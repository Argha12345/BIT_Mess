import React, { memo } from 'react';
import { STATUS_COLORS } from '../../config/constants';

const StatusBadge = memo(function StatusBadge({ status }) {
  const badgeClass = STATUS_COLORS[status?.toLowerCase()] || 'badge-secondary';
  return (
    <span className={`badge ${badgeClass}`}>
      {status?.toUpperCase()}
    </span>
  );
});

export default StatusBadge;
