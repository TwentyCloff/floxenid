import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebaseConfig';
import { collection, query, orderBy, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import AdminTicketCard from './AdminTicketCard';
import MessageList from './MessageList';
import TicketFilters from './TicketFilters';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import FileUpload from './FileUpload';

const AdminSupport = () => {
  const { user, isAdmin } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
    assignedTo: 'all'
  });
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    
    const q = query(
      collection(db, 'users'),
      where('roles.admin', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const agents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignedAgents(agents);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    
    let q = query(collection(db, 'tickets'), orderBy('updatedAt', 'desc'));
    
    const conditions = [];
    if (filters.status !== 'all') conditions.push(where('status', '==', filters.status));
    if (filters.priority !== 'all') conditions.push(where('priority', '==', filters.priority));
    if (filters.category !== 'all') conditions.push(where('category', '==', filters.category));
    if (filters.assignedTo !== 'all') conditions.push(where('assignedTo', '==', filters.assignedTo));
    
    if (conditions.length > 0) {
      q = query(collection(db, 'tickets'), ...conditions, orderBy('updatedAt', 'desc'));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTickets(ticketsData);
    });

    return () => unsubscribe();
  }, [isAdmin, filters]);

  useEffect(() => {
    if (!activeTicket) return;
    
    const q = query(
      collection(db, `tickets/${activeTicket.id}/messages`),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const messagesData = await Promise.all(snapshot.docs.map(async doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          text: data.encrypted ? await decryptMessage(data.text, data.sender === user.uid ? user.uid : activeTicket.createdBy) : data.text
        };
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [activeTicket, user]);

  const sendReply = async () => {
    if (!reply.trim() || !activeTicket) return;
    
    try {
      const encryptedReply = await encryptMessage(reply, activeTicket.createdBy);
      await addDoc(collection(db, `tickets/${activeTicket.id}/messages`), {
        sender: user.uid,
        text: encryptedReply,
        encrypted: true,
        timestamp: serverTimestamp(),
        isAdminReply: true,
        attachments
      });
      
      const updates = {
        updatedAt: serverTimestamp(),
        status: 'in_progress'
      };
      
      if (!activeTicket.assignedTo) {
        updates.assignedTo = user.uid;
        updates.assignedAt = serverTimestamp();
      }
      
      await updateDoc(doc(db, 'tickets', activeTicket.id), updates);
      
      setReply('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const updateTicketStatus = async (status) => {
    if (!activeTicket) return;
    
    try {
      const updates = {
        status,
        updatedAt: serverTimestamp()
      };
      
      if (status === 'closed') {
        updates.closedAt = serverTimestamp();
        updates.closedBy = user.uid;
      }
      
      await updateDoc(doc(db, 'tickets', activeTicket.id), updates);
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const assignTicket = async () => {
    if (!activeTicket || !selectedAgent) return;
    
    try {
      await updateDoc(doc(db, 'tickets', activeTicket.id), {
        assignedTo: selectedAgent,
        assignedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'assigned'
      });
      
      setIsAssigning(false);
      setSelectedAgent('');
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Dashboard</h1>
        <div className="text-sm text-gray-500">
          Logged in as <span className="font-semibold">{user?.email}</span>
        </div>
      </div>

      <TicketFilters 
        filters={filters} 
        setFilters={setFilters} 
        agents={assignedAgents} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">All Tickets</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {tickets.length} total
            </span>
          </div>
          <div className="divide-y max-h-[calc(100vh-200px)] overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No tickets match your filters
              </div>
            ) : (
              tickets.map((ticket) => (
                <AdminTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  isActive={activeTicket?.id === ticket.id}
                  onClick={() => setActiveTicket(ticket)}
                />
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {activeTicket ? (
            <>
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{activeTicket.subject}</h2>
                    <div className="flex items-center space-x-4 mt-1">
                      <StatusBadge status={activeTicket.status} />
                      <PriorityBadge priority={activeTicket.priority} />
                      <span className="text-sm text-gray-500">
                        Created: {new Date(activeTicket.createdAt?.toDate()).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {isAssigning ? (
                      <div className="flex space-x-2">
                        <select
                          value={selectedAgent}
                          onChange={(e) => setSelectedAgent(e.target.value)}
                          className="border rounded-md px-2 py-1 text-sm"
                        >
                          <option value="">Select agent</option>
                          {assignedAgents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.displayName || agent.email}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={assignTicket}
                          disabled={!selectedAgent}
                          className={`px-3 py-1 rounded-md text-sm ${!selectedAgent ? 'bg-gray-200 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => setIsAssigning(false)}
                          className="px-3 py-1 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        {activeTicket.assignedTo ? (
                          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                            Assigned to: {assignedAgents.find(a => a.id === activeTicket.assignedTo)?.displayName || 'Agent'}
                          </div>
                        ) : (
                          <button
                            onClick={() => setIsAssigning(true)}
                            className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
                          >
                            Assign
                          </button>
                        )}
                      </>
                    )}
                    
                    <div className="flex space-x-2">
                      <select
                        value={activeTicket.status}
                        onChange={(e) => updateTicketStatus(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="on_hold">On Hold</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <div>Category: <span className="font-medium">{activeTicket.category}</span></div>
                  <div>Created by: <span className="font-medium">{activeTicket.createdBy}</span></div>
                </div>
              </div>
              
              <MessageList 
                messages={messages} 
                userId={user?.uid} 
                showUserInfo={true}
              />
              
              <div className="p-4 border-t">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="w-full p-3 border rounded-md mb-2"
                  rows={3}
                  placeholder="Type your reply here..."
                />
                
                <FileUpload attachments={attachments} setAttachments={setAttachments} />
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Messages are end-to-end encrypted
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setReply('Can you please provide more details about this issue?');
                      }}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-gray-100"
                    >
                      Request Info
                    </button>
                    <button
                      onClick={sendReply}
                      disabled={!reply.trim()}
                      className={`px-4 py-2 rounded-md ${!reply.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;