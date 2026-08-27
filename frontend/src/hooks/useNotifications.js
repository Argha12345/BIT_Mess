import { useState, useEffect } from 'react';
import { api } from '@/api';


export function useNotifications(user) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const section = user && user.section ? user.section : 'Boys';
      if (section === 'All') return;

      const res = await api.notifications.get(section);
      setNotifications(res);
      setUnreadCount(res.length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleNotifications = () => {
    setShowNotifications(prev => !prev);
    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    showNotifications,
    toggleNotifications,
    clearNotifications
  };
}
