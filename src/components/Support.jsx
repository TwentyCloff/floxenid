import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (['floxenstaff@gmail.com', 'floxenowner@gmail.com'].includes(currentUser.email)) {
          navigate('/admin-support');
        } else {
          setUser(currentUser);
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
    });

    return () => unsubscribe();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const timestamp = Date.now();
    const messageId = `msg_${timestamp}_${user.uid}`;
    
    try {
      await setDoc(doc(db, 'supportMessages', messageId), {
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

      // Auto reply simulation
      setTimeout(async () => {
        const replyId = `reply_${Date.now()}_${user.uid}`;
        await setDoc(doc(db, 'supportMessages', replyId), {
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
    { question: "How to upgrade plan?", answer: "Go to pricing page" },
    { question: "Where are my files?", answer: "Check your dashboard" },
    { question: "Payment issues", answer: "Contact billing support" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex flex-col h-[calc(100vh-200px)]">
            <div className="border-b border-gray-200 p-4 bg-white">
              <h2 className="text-lg font-semibold">Support Center</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {showFAQ && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-white p-4 rounded-lg border"
                >
                  <h3 className="font-medium mb-2">FAQs</h3>
                  {FAQItems.map((faq, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setNewMessage(faq.question);
                        setShowFAQ(false);
                      }}
                      className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                    >
                      <p className="font-medium">{faq.question}</p>
                      <p className="text-sm text-gray-500">{faq.answer}</p>
                    </button>
                  ))}
                </motion.div>
              )}

              <div className="space-y-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border text-gray-800'
                    }`}>
                      <p>{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.sender === 'user' ? 'You' : 'Support'} • {msg.createdAt?.toDate().toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg p-2 px-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                  placeholder="Type your message..."
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
