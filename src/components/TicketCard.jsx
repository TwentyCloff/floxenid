import React from 'react';
import StatusBadge from './StatusBadge';

const TicketCard = ({ ticket, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer border-b ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium">{ticket.subject}</h3>
          <p className="text-xs text-gray-500">{ticket.category}</p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>
      <div className="mt-1 text-xs text-gray-500">
        Last updated: {new Date(ticket.updatedAt?.toDate()).toLocaleString()}
      </div>
    </div>
  );
};

export default TicketCard;