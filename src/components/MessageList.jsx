import React from 'react';

const MessageList = ({ messages, userId, showUserInfo = false }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === userId ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
              message.sender === userId
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {showUserInfo && message.sender !== userId && (
              <div className="text-xs font-semibold mb-1">
                {message.senderName || 'Support Agent'}
              </div>
            )}
            <div className="text-sm">{message.text}</div>
            <div className="text-xs mt-1 opacity-70">
              {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;