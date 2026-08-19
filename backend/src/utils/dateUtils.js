import { DAYS_OF_WEEK } from '../config/constants.js';

export const getDayNameFromDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  return DAYS_OF_WEEK[dateObj.getDay()];
};

export const isAtLeastDaysPrior = (targetDateStr, daysCount = 7) => {
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays >= daysCount;
};

export const formatShortDate = (dateStr) => {
  if (typeof dateStr === 'string' && dateStr.length >= 10) {
    return dateStr.substring(5);
  }
  return dateStr;
};
