import React, { useEffect, useState } from 'react';
import { fetchMyTickets } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { TicketCard } from '../components/TicketCard';
import { Loader } from '../components/UI';
import { Ticket, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyTickets = () => {
  const { walletAddress, connectWallet } = useWallet();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      fetchMyTickets(walletAddress)
        .then((res) => {
          if (res.success) setTickets(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [walletAddress]);

  if (!walletAddress) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-900/80 border border-slate-800 rounded-3xl text-center space-y-6">
        <Wallet className="w-12 h-12 text-indigo-400 mx-auto" />
        <h2 className="text-xl font-black text-white">Connect Your Wallet</h2>
        <p className="text-xs text-slate-400">
          Connect your Freighter wallet to view your purchased StellarPass tickets and QR passes.
        </p>
        <button onClick={connectWallet} className="w-full gradient-button py-3 rounded-xl text-xs font-bold">
          Connect Freighter Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white">My On-Chain Passes</h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically verified event passes owned by wallet: <span className="font-mono text-indigo-300">{walletAddress}</span>
        </p>
      </div>

      {loading ? (
        <Loader label="Fetching your Stellar passes..." />
      ) : tickets.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
          <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No Tickets Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">You have not purchased any event tickets yet using this connected wallet address.</p>
          <Link to="/events" className="inline-flex items-center space-x-1.5 gradient-button px-5 py-2.5 rounded-xl text-xs font-bold">
            <span>Browse Available Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id || ticket.ticketId} ticket={ticket} />
          ))}
        </div>
      )}

    </div>
  );
};
