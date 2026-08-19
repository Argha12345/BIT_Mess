import { useState } from 'react';
import { api } from '../utils/api';

export function useAuth({ setUser, setActivePage, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);

    if (!rollNo || !password) {
      setIsLoading(false);
      return setAuthError('Email Address/Admin ID and Password are required');
    }

    try {
      const res = await api.auth.login(rollNo, password);
      setAuthSuccess('Welcome back! Logging you in...');
      setTimeout(() => {
        if (setUser) setUser(res.user);
        if (setActivePage) {
          setActivePage(res.user.role === 'admin' ? 'admin-panel' : 'student-portal');
        }
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async (googleIdToken) => {
    setAuthError('');
    setAuthSuccess('');
    setIsLoading(true);
    try {
      const res = await api.auth.googleLogin(googleIdToken);
      setAuthSuccess(`Welcome, ${res.user.name}! Sign-In successful...`);
      setTimeout(() => {
        if (setUser) setUser(res.user);
        if (setActivePage) {
          setActivePage(res.user.role === 'admin' ? 'admin-panel' : 'student-portal');
        }
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      setAuthError(err.message || 'Google Sign-In failed.');
      setIsLoading(false);
    }
  };

  return {
    showPassword,
    setShowPassword,
    rollNo,
    setRollNo,
    password,
    setPassword,
    authError,
    authSuccess,
    isLoading,
    handleAuthSubmit,
    handleGoogleAuth
  };
}
