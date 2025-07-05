import React from 'react';

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  on_hold: 'bg-purple-100 text-purple-800',
  closed: 'bg-green-100 text-green-800',
  assigned: 'bg-indigo-100 text-indigo-800',
};

const StatusBadge = ({ status }) => {
  const displayStatus = status.replace('_', ' ');
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {displayStatus}
    </span>
  );
};

export default StatusBadge;