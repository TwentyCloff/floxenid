import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, orderBy, doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';

const AdminSupport = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, 'supportMessages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersMap = new Map();
      
      snapshot.forEach(doc => {
        const msg = doc.data();
        if (!usersMap.has(msg.userId)) {
          usersMap.set(msg.userId, {
            userId: msg.userId,
            userEmail: msg.userEmail,
            userName: msg.userName || msg.userEmail?.split('@')[0] || 'User',
            lastMessage: msg.text,
            lastMessageTime: msg.createdAt
          });
        }
      });

      setConversations(Array.from(usersMap.values()));
      
      if (!selectedUser && usersMap.size > 0) {
        setSelectedUser(usersMap.values().next().value);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const q = query(
      collection(db, 'supportMessages'),
      where('userId', '==', selectedUser.userId),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = [];
      snapshot.forEach(doc => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const timestamp = Date.now();
    const messageId = `admin_${timestamp}_${selectedUser.userId}`;
    
    try {
      await setDoc(doc(db, 'supportMessages', messageId), {
        text: newMessage,
        sender: 'support',
        userId: selectedUser.userId,
        userEmail: selectedUser.userEmail,
        userName: selectedUser.userName,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
            <div className="w-full md:w-64 border-r bg-gray-50 p-4 overflow-y-auto">
              <h2 className="font-semibold mb-4">Conversations</h2>
              {conversations.map(user => (
                <div
                  key={user.userId}
                  onClick={() => setSelectedUser(user)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer ${
                    selectedUser?.userId === user.userId
                      ? 'bg-blue-100 border border-blue-200'
                      : 'bg-white border hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium truncate">{user.userName}</p>
                  <p className="text-sm text-gray-500 truncate">{user.userEmail}</p>
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {user.lastMessage?.substring(0, 50)}{user.lastMessage?.length > 50 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex-1 flex flex-col">
              <div className="border-b p-4 bg-white">
                <h2 className="font-semibold">
                  {selectedUser ? `Chat with ${selectedUser.userName}` : 'Select a conversation'}
                </h2>
                <p className="text-sm text-gray-500">{selectedUser?.userEmail}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {selectedUser ? (
                  <div className="space-y-3">
                    {messages.map(msg => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          msg.sender === 'support' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === 'support' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white border text-gray-800'
                        }`}>
                          <p>{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {msg.sender === 'support' ? 'You' : selectedUser.userName} • {msg.createdAt?.toDate().toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    Select a conversation from the sidebar
                  </div>
                )}
              </div>

              <div className="border-t p-4 bg-white">
                {selectedUser ? (
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                      placeholder="Type your reply..."
                      className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </form>
                ) : (
                  <div className="text-center text-gray-500">
                    Select a user to start chatting
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
