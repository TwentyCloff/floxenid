import React from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const AdminTicketCard = ({ ticket, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</h3>
          <p className="text-xs text-gray-500 truncate">From: {ticket.createdBy}</p>
        </div>
        <div className="ml-2 flex-shrink-0 flex">
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <StatusBadge status={ticket.status} />
        <span className="text-xs text-gray-500">
          {new Date(ticket.createdAt?.toDate()).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default AdminTicketCard;