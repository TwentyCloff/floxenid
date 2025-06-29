import React, { useState } from 'react';
import { API_URL } from '../config';

const AIChat = () => {
  const [chats, setChats] = useState([{ id: Date.now(), messages: [] }]);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const currentChat = chats.find(chat => chat.id === activeChatId);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };

    updateChat(activeChatId, prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...currentChat.messages, userMsg] })
      });

      const data = await response.json();

      // streaming effect
      let displayed = "";
      for (let char of data.content) {
        displayed += char;
        await new Promise(resolve => setTimeout(resolve, 15));
        updateChat(activeChatId, prev => [
          ...prev.filter(m => m.role !== "assistant"), 
          { role: "assistant", content: displayed }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateChat = (id, updater) => {
    setChats(prev => prev.map(chat =>
      chat.id === id
        ? { ...chat, messages: updater(chat.messages) }
        : chat
    ));
  };

  const addNewChat = () => {
    const newChat = { id: Date.now(), messages: [] };
    setChats(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 p-4 border-r">
        <button
          onClick={addNewChat}
          className="w-full mb-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Chat
        </button>
        <div className="space-y-2">
          {chats.map(chat => (
            <div key={chat.id}
              className={`cursor-pointer p-2 rounded ${activeChatId === chat.id ? "bg-blue-200" : "hover:bg-gray-200"}`}
              onClick={() => setActiveChatId(chat.id)}>
              Chat {chat.id}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="flex-1 overflow-y-auto border rounded p-4 bg-gray-50 mb-4">
          {currentChat.messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span className={`${msg.role === "user" ? "bg-blue-200" : "bg-green-200"} inline-block px-3 py-1 rounded`}>
                {msg.content}
              </span>
            </div>
          ))}
          {loading && (
            <div className="text-left mb-2">
              <span className="bg-green-200 inline-block px-3 py-1 rounded animate-pulse">
                Typing...
              </span>
            </div>
          )}
        </div>

        <div className="flex">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSend}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
