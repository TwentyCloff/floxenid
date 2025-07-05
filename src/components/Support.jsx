import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebaseConfig';
import { collection, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import TicketCard from './TicketCard';
import MessageList from './MessageList';

const Support = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debug log
  console.log('User:', user);
  console.log('Active Ticket:', activeTicket);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tickets'),
      where('createdBy', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Tickets Data:', ticketsData); // Debug log
      setTickets(ticketsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-red-500">
        Please login to access support
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading tickets...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Support Tickets</h1>
      
      {tickets.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg">
          No tickets found. Create your first ticket!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tickets.map(ticket => (
            <TicketCard 
              key={ticket.id}
              ticket={ticket}
              onClick={() => setActiveTicket(ticket)}
            />
          ))}
        </div>
      )}

      {activeTicket && (
        <div className="mt-6 border-t pt-4">
          <MessageList ticketId={activeTicket.id} />
        </div>
      )}
    </div>
  );
};

export default Support;