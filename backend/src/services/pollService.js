import { pollRepository } from '../repositories/pollRepository.js';
import { menuRepository } from '../repositories/menuRepository.js';
import { notificationRepository } from '../repositories/notificationRepository.js';
import { getDayNameFromDate, isAtLeastDaysPrior } from '../utils/dateUtils.js';

export const pollService = {
  createPoll: async ({ section, targetDate, meal, options }) => {
    if (!section || !targetDate || !meal || !options || !Array.isArray(options)) {
      const err = new Error('Missing required poll fields');
      err.status = 400;
      throw err;
    }

    if (options.length < 2) {
      const err = new Error('A poll must have at least 2 options');
      err.status = 400;
      throw err;
    }

    if (!isAtLeastDaysPrior(targetDate, 7)) {
      const err = new Error('Polls must be posted at least 1 week (7 days) prior to the target date');
      err.status = 400;
      throw err;
    }

    const formattedOptions = options.map((opt, index) => ({
      id: `opt-${Date.now()}-${index}`,
      name: opt,
      votes: []
    }));

    return await pollRepository.create({
      section,
      targetDate,
      meal,
      status: 'open',
      options: formattedOptions,
      winner: '',
      createdAt: new Date().toISOString()
    });
  },

  getPolls: async (section) => {
    return await pollRepository.findBySection(section);
  },

  votePoll: async (id, { rollNo, optionId }) => {
    if (!rollNo || !optionId) {
      const err = new Error('Roll number and option ID are required to vote');
      err.status = 400;
      throw err;
    }

    const poll = await pollRepository.findById(id);
    if (!poll) {
      const err = new Error('Poll not found');
      err.status = 404;
      throw err;
    }

    if (poll.status !== 'open') {
      const err = new Error('Voting is only allowed on active polls');
      err.status = 400;
      throw err;
    }

    let previouslyVotedOptionId = null;
    poll.options.forEach(opt => {
      if (opt.votes.includes(rollNo)) {
        previouslyVotedOptionId = opt.id;
        opt.votes = opt.votes.filter(v => v !== rollNo);
      }
    });

    if (previouslyVotedOptionId !== optionId) {
      const targetOption = poll.options.find(opt => opt.id === optionId);
      if (targetOption) {
        targetOption.votes.push(rollNo);
      }
    }

    const updatedPoll = await pollRepository.update(id, { options: poll.options });
    return {
      message: previouslyVotedOptionId === optionId ? 'Vote removed' : 'Vote registered successfully',
      poll: updatedPoll
    };
  },

  closePoll: async (id) => {
    const poll = await pollRepository.findById(id);
    if (!poll) {
      const err = new Error('Poll not found');
      err.status = 404;
      throw err;
    }

    if (poll.status !== 'open') {
      const err = new Error('Only open polls can be closed');
      err.status = 400;
      throw err;
    }

    let maxVotes = -1;
    let winningOptions = [];

    poll.options.forEach(opt => {
      const count = opt.votes ? opt.votes.length : 0;
      if (count > maxVotes) {
        maxVotes = count;
        winningOptions = [opt];
      } else if (count === maxVotes) {
        winningOptions.push(opt);
      }
    });

    if (winningOptions.length > 1) {
      const updatedPoll = await pollRepository.update(id, { status: 'tie' });
      return {
        message: 'Voting closed with a tie. Admin intervention required to resolve the winner.',
        status: 'tie',
        poll: updatedPoll
      };
    }

    const winnerName = winningOptions[0].name;
    const dayName = getDayNameFromDate(poll.targetDate);

    const allMenu = await menuRepository.findAll();
    const menuItem = allMenu.find(item => item.section === poll.section && item.day === dayName && item.meal === poll.meal);

    if (menuItem) {
      await menuRepository.updateItem(menuItem.id, { items: winnerName, popularity: 9 });
    }

    await notificationRepository.addNotification({
      section: poll.section,
      studentRollNo: 'All',
      message: `🎉 Menu Updated! ${dayName} ${poll.meal} has been updated to "${winnerName}" based on student voting (Winner with ${maxVotes} votes)!`,
      createdAt: new Date().toISOString()
    });

    const updatedPoll = await pollRepository.update(id, { status: 'closed', winner: winnerName });

    return {
      message: `Voting closed. "${winnerName}" confirmed and menu updated.`,
      status: 'closed',
      poll: updatedPoll
    };
  },

  resolveTie: async (id, winnerName) => {
    if (!winnerName) {
      const err = new Error('Winner selection is required to resolve a tie');
      err.status = 400;
      throw err;
    }

    const poll = await pollRepository.findById(id);
    if (!poll) {
      const err = new Error('Poll not found');
      err.status = 404;
      throw err;
    }

    const dayName = getDayNameFromDate(poll.targetDate);

    const allMenu = await menuRepository.findAll();
    const menuItem = allMenu.find(item => item.section === poll.section && item.day === dayName && item.meal === poll.meal);

    if (menuItem) {
      await menuRepository.updateItem(menuItem.id, { items: winnerName, popularity: 9 });
    }

    await notificationRepository.addNotification({
      section: poll.section,
      studentRollNo: 'All',
      message: `🎉 Tie Resolved by Admin! ${dayName} ${poll.meal} has been updated to "${winnerName}".`,
      createdAt: new Date().toISOString()
    });

    const updatedPoll = await pollRepository.update(id, { status: 'closed', winner: winnerName });

    return {
      message: `Tie resolved. "${winnerName}" confirmed and menu updated.`,
      poll: updatedPoll
    };
  },

  deletePoll: async (id) => {
    const deleted = await pollRepository.delete(id);
    if (!deleted) {
      const err = new Error('Poll not found');
      err.status = 404;
      throw err;
    }
    return { message: 'Poll deleted successfully' };
  }
};
