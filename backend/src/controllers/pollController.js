import { pollService } from '../services/pollService.js';

export const createPoll = async (req, res, next) => {
  try {
    const poll = await pollService.createPoll(req.body);
    res.status(201).json({
      message: 'Food change poll posted successfully',
      poll
    });
  } catch (error) {
    next(error);
  }
};

export const getPolls = async (req, res, next) => {
  try {
    const { section } = req.query;
    const polls = await pollService.getPolls(section);
    res.json(polls);
  } catch (error) {
    next(error);
  }
};

export const votePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pollService.votePoll(id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const closePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pollService.closePoll(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const resolveTie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { winnerName } = req.body;
    const result = await pollService.resolveTie(id, winnerName);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const deletePoll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pollService.deletePoll(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
