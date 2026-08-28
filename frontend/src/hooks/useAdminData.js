import { useState, useEffect } from 'react';
import { api } from '@/api';


export function useAdminData() {
  const [selectedSection, setSelectedSection] = useState('Boys');
  const [menuItems, setMenuItems] = useState([]);
  const [wasteLogs, setWasteLogs] = useState([]);
  const [polls, setPolls] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [wasteAnalytics, setWasteAnalytics] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // User Management States
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentHostel, setNewStudentHostel] = useState('Sapphire');
  const [newStudentSection, setNewStudentSection] = useState('Boys');

  // User Editing States
  const [editingUserId, setEditingUserId] = useState(null);
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserName, setEditUserName] = useState('');
  const [editUserHostel, setEditUserHostel] = useState('Sapphire');
  const [editUserSection, setEditUserSection] = useState('Boys');

  // Form States
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editItemsText, setEditItemsText] = useState('');
  const [editPopularity, setEditPopularity] = useState(8);

  const [wasteDate, setWasteDate] = useState(new Date().toISOString().split('T')[0]);
  const [wasteMeal, setWasteMeal] = useState('Lunch');
  const [wasteMenuItem, setWasteMenuItem] = useState('');
  const [cookedMeals, setCookedMeals] = useState(650);
  const [actualDiners, setActualDiners] = useState(620);
  const [preConsumerWaste, setPreConsumerWaste] = useState(10);
  const [postConsumerWaste, setPostConsumerWaste] = useState(25);
  const [reusableWaste, setReusableWaste] = useState(8);
  const [nonReusableWaste, setNonReusableWaste] = useState(27);
  const [dispositionStatus, setDispositionStatus] = useState('Disposed');

  // Donation & Repurpose Action States
  const [donateOrg, setDonateOrg] = useState('Hope NGO Orphanage');
  const [donatedKg, setDonatedKg] = useState(15);
  const [repurposeTargetMeal, setRepurposeTargetMeal] = useState('Dinner');
  const [repurposedKg, setRepurposedKg] = useState(12);


  const [pollTargetDate, setPollTargetDate] = useState('');
  const [pollMeal, setPollMeal] = useState('Lunch');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');
  const [pollOption3, setPollOption3] = useState('');

  const [resDateFilter, setResDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [resMealFilter, setResMealFilter] = useState('Dinner');
  const [resStatusFilter, setResStatusFilter] = useState('');

  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [menuRes, wasteRes, pollsRes, resRes, analyticsRes, feedbacksRes, usersRes, notifsRes] = await Promise.all([
        api.menu.get(selectedSection),
        api.waste.getLogs(selectedSection),
        api.polls.get(selectedSection),
        api.reservations.getAdminList(resDateFilter, resMealFilter, selectedSection, resStatusFilter),
        api.analytics.getWaste(selectedSection),
        api.waste.getFeedbacks(selectedSection),
        api.users.getAll().catch(() => []),
        api.notifications.get(selectedSection).catch(() => [])
      ]);

      setMenuItems(menuRes);
      setWasteLogs(wasteRes);
      setPolls(pollsRes);
      setReservations(resRes);
      setWasteAnalytics(analyticsRes);
      setFeedbacks(feedbacksRes);
      setUsersList(usersRes);
      setNotificationsList(notifsRes);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [selectedSection, resDateFilter, resMealFilter, resStatusFilter]);

  const showFeedbackMsg = (msg, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(''), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // User Accounts Actions
  const handleCreateStudentAccount = async (e) => {
    e.preventDefault();
    try {
      await api.users.create({
        rollNo: newStudentEmail,
        name: newStudentName,
        password: newStudentPassword,
        hostel: newStudentHostel,
        section: newStudentSection,
        messType: 'Standard',
        role: 'student'
      });
      showFeedbackMsg(`Student account created for ${newStudentEmail}!`);
      setNewStudentEmail('');
      setNewStudentName('');
      setNewStudentPassword('');
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to create student account', true);
    }
  };

  const handleUpdateUserAccount = async (id) => {
    try {
      await api.users.update(id, {
        rollNo: editUserEmail,
        name: editUserName,
        hostel: editUserHostel,
        section: editUserSection
      });
      showFeedbackMsg(`Account details updated for ${editUserName}!`);
      setEditingUserId(null);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to update user account', true);
    }
  };

  const handleDeleteUserAccount = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the account for ${name}?`)) return;
    try {
      await api.users.delete(id);
      showFeedbackMsg(`Account for ${name} deleted successfully.`);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to delete account', true);
    }
  };

  // Notification Broadcast Actions
  const handleSendNotification = async ({ section, studentRollNo, message }) => {
    try {
      await api.notifications.send({ section, studentRollNo, message });
      showFeedbackMsg('Notification broadcasted to student notification panels!');
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to broadcast notification', true);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.notifications.delete(id);
      showFeedbackMsg('Notification record deleted.');
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to delete notification', true);
    }
  };

  // Fake Review Deletion Action
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.waste.deleteFeedback(id);
      showFeedbackMsg('Student review deleted successfully.');
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to delete review', true);
    }
  };

  // Standard Actions
  const handleUpdateMenuItem = async (id) => {
    try {
      await api.menu.update(id, { items: editItemsText, popularity: editPopularity });
      showFeedbackMsg('Menu item updated successfully!');
      setEditingMenuItem(null);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to update menu item', true);
    }
  };

  const handleLogWaste = async (e) => {
    e.preventDefault();
    try {
      await api.waste.logDaily({
        section: selectedSection,
        date: wasteDate,
        meal: wasteMeal,
        menuItem: wasteMenuItem || 'Standard Meal',
        cookedMeals,
        actualDiners,
        preConsumerWaste,
        postConsumerWaste,
        reusableWaste,
        nonReusableWaste,
        dispositionStatus
      });
      showFeedbackMsg('Daily food waste log recorded with Reusable/Non-reusable categorization!');
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to log waste', true);
    }
  };

  const handleDonateFood = async (e) => {
    e.preventDefault();
    try {
      await api.waste.donateFood({
        section: selectedSection,
        date: wasteDate,
        meal: wasteMeal,
        menuItem: wasteMenuItem || 'Fresh Surplus Food',
        organizationName: donateOrg,
        donatedKg: Number(donatedKg),
        notes: `Fresh surplus dispatched to ${donateOrg}`
      });
      showFeedbackMsg(`Successfully registered ${donatedKg} kg food donation to ${donateOrg}!`);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to dispatch donation', true);
    }
  };

  const handleRepurposeFood = async (e) => {
    e.preventDefault();
    try {
      await api.waste.repurposeFood({
        section: selectedSection,
        date: wasteDate,
        meal: wasteMeal,
        menuItem: wasteMenuItem || 'Unserved Excess Food',
        repurposedMeal: repurposeTargetMeal,
        repurposedKg: Number(repurposedKg),
        notes: `Surplus food repurposed for ${repurposeTargetMeal}`
      });
      showFeedbackMsg(`Successfully scheduled ${repurposedKg} kg excess food for ${repurposeTargetMeal} repurposing!`);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to schedule repurposing', true);
    }
  };


  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const options = [pollOption1, pollOption2, pollOption3].filter(o => o.trim() !== '');
    if (options.length < 2) {
      return showFeedbackMsg('Please enter at least 2 food options', true);
    }
    try {
      await api.polls.create({
        section: selectedSection,
        targetDate: pollTargetDate,
        meal: pollMeal,
        options
      });
      showFeedbackMsg('Food change poll published!');
      setPollOption1('');
      setPollOption2('');
      setPollOption3('');
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to post poll', true);
    }
  };

  const handleClosePoll = async (pollId) => {
    try {
      const res = await api.polls.close(pollId);
      showFeedbackMsg(res.message);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to close poll', true);
    }
  };

  const handleResolveTie = async (pollId, winnerName) => {
    try {
      const res = await api.polls.resolve(pollId, winnerName);
      showFeedbackMsg(res.message);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to resolve tie', true);
    }
  };

  const handleDeletePoll = async (pollId) => {
    try {
      await api.polls.delete(pollId);
      showFeedbackMsg('Poll deleted successfully!');
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to delete poll', true);
    }
  };

  const handleUpdateReservationStatus = async (id, status) => {
    try {
      await api.reservations.updateStatus(id, status);
      showFeedbackMsg(`Reservation status updated to ${status}`);
      fetchAdminData();
    } catch (err) {
      showFeedbackMsg(err.message || 'Failed to update status', true);
    }
  };

  return {
    selectedSection,
    setSelectedSection,
    menuItems,
    wasteLogs,
    polls,
    reservations,
    wasteAnalytics,
    feedbacks,
    usersList,
    notificationsList,
    isLoading,
    newStudentEmail,
    setNewStudentEmail,
    newStudentName,
    setNewStudentName,
    newStudentPassword,
    setNewStudentPassword,
    newStudentHostel,
    setNewStudentHostel,
    newStudentSection,
    setNewStudentSection,
    editingUserId,
    setEditingUserId,
    editUserEmail,
    setEditUserEmail,
    editUserName,
    setEditUserName,
    editUserHostel,
    setEditUserHostel,
    editUserSection,
    setEditUserSection,
    editingMenuItem,
    setEditingMenuItem,
    editItemsText,
    setEditItemsText,
    editPopularity,
    setEditPopularity,
    wasteDate,
    setWasteDate,
    wasteMeal,
    setWasteMeal,
    wasteMenuItem,
    setWasteMenuItem,
    cookedMeals,
    setCookedMeals,
    actualDiners,
    setActualDiners,
    preConsumerWaste,
    setPreConsumerWaste,
    postConsumerWaste,
    setPostConsumerWaste,
    reusableWaste,
    setReusableWaste,
    nonReusableWaste,
    setNonReusableWaste,
    dispositionStatus,
    setDispositionStatus,
    donateOrg,
    setDonateOrg,
    donatedKg,
    setDonatedKg,
    repurposeTargetMeal,
    setRepurposeTargetMeal,
    repurposedKg,
    setRepurposedKg,
    pollTargetDate,
    setPollTargetDate,
    pollMeal,
    setPollMeal,
    pollOption1,
    setPollOption1,
    pollOption2,
    setPollOption2,
    pollOption3,
    setPollOption3,
    resDateFilter,
    setResDateFilter,
    resMealFilter,
    setResMealFilter,
    resStatusFilter,
    setResStatusFilter,
    actionSuccess,
    actionError,
    handleSendNotification,
    handleDeleteNotification,
    handleCreateStudentAccount,
    handleUpdateUserAccount,
    handleDeleteUserAccount,
    handleDeleteReview,
    handleUpdateMenuItem,
    handleLogWaste,
    handleDonateFood,
    handleRepurposeFood,
    handleCreatePoll,
    handleClosePoll,
    handleResolveTie,
    handleDeletePoll,
    handleUpdateReservationStatus,
    fetchAdminData
  };
}

