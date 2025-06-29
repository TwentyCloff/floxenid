import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, doc, setDoc, serverTimestamp, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showFAQ, setShowFAQ] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (['floxenstaff@gmail.com', 'floxenowner@gmail.com'].includes(currentUser.email)) {
          navigate('/admin-support');
        } else {
          setUser(currentUser);
          // Create user document if not exists
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              displayName: currentUser.displayName || currentUser.email.split('@')[0],
              email: currentUser.email,
              createdAt: serverTimestamp()
            });
          }
        }
      } else {
        navigate('/sign-in');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'supportMessages'),
      where('userId', '==', user.uid),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
      scrollToBottom();
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    return () => unsubscribe();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      // Create message with timestamp ID
      const timestamp = Date.now();
      const messageRef = doc(db, 'supportMessages', `msg_${timestamp}_${user.uid}`);
      
      await setDoc(messageRef, {
        text: newMessage,
        sender: 'user',
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email.split('@')[0],
        createdAt: serverTimestamp()
      });

      setNewMessage('');
      setShowFAQ(false);
      setIsTyping(true);

      // Simulate support response
      setTimeout(async () => {
        const responseTimestamp = Date.now();
        const responseRef = doc(db, 'supportMessages', `msg_${responseTimestamp}_support_${user.uid}`);
        
        await setDoc(responseRef, {
          text: "Thank you for your message. Our team will respond shortly.",
          sender: 'support',
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const FAQItems = [
    {
      question: "How do I upgrade my plan?",
      answer: "You can upgrade from your account dashboard."
    },
    {
      question: "Where can I find documentation?",
      answer: "Visit our documentation page."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "Go to billing settings in your account."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-gray-200 bg-gray-50 p-4 hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Support History</h2>
              {user && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-800">Current Conversation</p>
                  <p className="text-xs text-blue-600">{user.email}</p>
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
                    <h2 className="text-lg font-semibold text-gray-800">Support Center</h2>
                    <p className="text-xs text-gray-500">We're here to help you</p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {showFAQ && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">FAQs</h3>
                      <div className="space-y-2">
                        {FAQItems.map((faq, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setNewMessage(faq.question);
                              setShowFAQ(false);
                            }}
                            className="w-full text-left p-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <p className="text-sm font-medium text-gray-800">{faq.question}</p>
                            <p className="text-xs text-gray-500 mt-1">{faq.answer}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                        message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.sender === 'user' ? 'You' : 'Support'} •{' '}
                          {message.createdAt?.toDate().toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    placeholder="Type your message..."
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
