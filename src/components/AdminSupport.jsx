import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';

const AdminSupport = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user || !['floxenstaff@gmail.com', 'floxenowner@gmail.com'].includes(user.email)) {
        window.location.href = '/support';
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'supportMessages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userMap = new Map();
      const convos = [];

      querySnapshot.forEach((doc) => {
        const message = doc.data();
        if (!userMap.has(message.userId)) {
          convos.push({
            userId: message.userId,
            userEmail: message.userEmail,
            userName: message.userName || message.userEmail?.split('@')[0] || 'User',
            lastMessage: message.text,
            lastMessageTime: message.createdAt
          });
          userMap.set(message.userId, true);
        }
      });

      setConversations(convos);
      setIsLoading(false);

      if (convos.length > 0 && !selectedConversation) {
        setSelectedConversation(convos[0]);
      }
    }, (error) => {
      console.error("Error fetching conversations:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  useEffect(() => {
    if (!selectedConversation) return;

    const q = query(
      collection(db, 'supportMessages'),
      where('userId', '==', selectedConversation.userId),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      scrollToBottom();
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const timestamp = Date.now();
      const messageRef = doc(db, 'supportMessages', `msg_${timestamp}_admin_${selectedConversation.userId}`);
      
      await setDoc(messageRef, {
        text: newMessage,
        sender: 'support',
        userId: selectedConversation.userId,
        userEmail: selectedConversation.userEmail,
        userName: selectedConversation.userName,
        createdAt: serverTimestamp()
      });

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Conversations</h2>
              {conversations.length === 0 ? (
                <p className="text-sm text-gray-500">No conversations yet</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((convo) => (
                    <div
                      key={convo.userId}
                      onClick={() => setSelectedConversation(convo)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation?.userId === convo.userId
                          ? 'bg-blue-100 border border-blue-200'
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {convo.userName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{convo.userEmail}</p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {convo.lastMessage?.substring(0, 50)}{convo.lastMessage?.length > 50 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4 bg-white">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {selectedConversation?.userName || 'Select a conversation'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedConversation?.userEmail || ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {selectedConversation ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                          message.sender === 'support' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.sender === 'support' ? 'You' : selectedConversation.userName} •{' '}
                            {message.createdAt?.toDate().toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                      <p className="mt-1 text-sm text-gray-500">Select a conversation from the sidebar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                {selectedConversation ? (
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                      placeholder="Type your reply..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <div className="text-center text-sm text-gray-500">
                    Select a conversation to reply
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
