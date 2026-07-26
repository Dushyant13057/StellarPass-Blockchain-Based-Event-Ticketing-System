import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById, purchaseTicketApi } from '../services/api';
import { executeStellarPayment } from '../services/stellar';
import { useWallet } from '../context/WalletContext';
import { Loader } from '../components/UI';
import { Calendar, Clock, MapPin, Ticket, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { walletAddress, connectWallet, showToast } = useWallet();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState(null); // 'connecting' | 'signing' | 'verifying' | 'success'
  const [purchasedTicket, setPurchasedTicket] = useState(null);

  useEffect(() => {
    fetchEventById(id)
      .then((res) => {
        if (res.success) setEvent(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handlePurchase = async () => {
    let currentWallet = walletAddress;

    // Step 1: Wallet Connection Check
    if (!currentWallet) {
      setPurchaseStep('connecting');
      currentWallet = await connectWallet();
      if (!currentWallet) return;
    }

    setPurchasing(true);
    try {
      // Step 2: Sign Stellar Horizon Transaction via Freighter Wallet
      setPurchaseStep('signing');
      showToast('Please approve the XLM payment in your Freighter Wallet popup...', 'info');

      const paymentResult = await executeStellarPayment({
        senderPublicKey: currentWallet,
        recipientPublicKey: event.organizerWallet || 'GAUM62OKQLHHAGXYWOGDLCSGTNJLQ6OAVWUAUXRCPTEUQV22LQRO4GUF',
        amountXlm: event.ticketPrice,
        memoText: `SP-${event._id.substring(0, 8)}`
      });

      if (!paymentResult || !paymentResult.hash) {
        throw new Error('Payment transaction failed or hash not returned.');
      }

      // Step 3: Send Transaction Hash to Backend for Horizon Verification & QR Minting
      setPurchaseStep('verifying');
      showToast('Verifying transaction hash on Stellar Horizon Testnet...', 'info');

      const purchaseRes = await purchaseTicketApi({
        eventId: event._id,
        walletAddress: currentWallet,
        transactionHash: paymentResult.hash,
        pricePaid: event.ticketPrice
      });

      if (purchaseRes.success) {
        setPurchaseStep('success');
        setPurchasedTicket(purchaseRes.data);
        showToast('Ticket successfully minted and verified on Stellar Blockchain!', 'success');
      } else {
        throw new Error(purchaseRes.message || 'Server ticket verification failed.');
      }
    } catch (err) {
      showToast(err.message || 'Ticket purchase failed', 'error');
      setPurchaseStep(null);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <Loader label="Loading event details..." />;
  if (!event) return (
    <div className="text-center py-20 text-slate-400">
      <p>Event not found.</p>
    </div>
  );

  const isSoldOut = event.availableTickets <= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/events')}
        className="flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      {/* Banner */}
      <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-indigo-600/80 text-white text-[11px] font-bold">
              {event.category || 'Tech & Crypto'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{event.title}</h1>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700/60 text-right shrink-0">
            <span className="text-[10px] text-slate-400 block font-semibold">TICKET PRICE</span>
            <span className="text-2xl font-black text-white">{event.ticketPrice} XLM</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Event Meta & Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">About This Event</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Organizer Details</h3>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400">
                {event.organizerName ? event.organizerName.substring(0, 2).toUpperCase() : 'SO'}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{event.organizerName}</p>
                <p className="font-mono text-[11px] text-slate-400 break-all">{event.organizerWallet}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Card / Checkout */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl sticky top-28">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-400" />
              <span>Checkout Ticket</span>
            </h3>

            <div className="space-y-3 text-xs border-y border-slate-800/80 py-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Date</span>
                <span className="font-semibold text-white">{event.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /> Time</span>
                <span className="font-semibold text-white">{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-400" /> Venue</span>
                <span className="font-semibold text-white truncate max-w-[140px]">{event.venue}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Available Seats</span>
                <span className={`font-bold ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {event.availableTickets} / {event.totalTickets}
                </span>
              </div>
            </div>

            {/* Wallet status */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[11px]">
              <span className="text-slate-400 block font-medium">Connected Wallet</span>
              {walletAddress ? (
                <span className="font-mono text-indigo-300 font-semibold break-all">{walletAddress}</span>
              ) : (
                <span className="text-amber-400 font-semibold">Freighter Wallet Not Connected</span>
              )}
            </div>

            {/* Purchase CTA */}
            {purchaseStep === 'success' ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Ticket Issued!</h4>
                <p className="text-xs text-slate-300">Your StellarPass ticket has been minted.</p>
                <button
                  onClick={() => navigate('/my-tickets')}
                  className="w-full py-2.5 rounded-xl gradient-button text-xs font-bold"
                >
                  View in My Tickets
                </button>
              </div>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={purchasing || isSoldOut}
                className={`w-full py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all ${
                  isSoldOut
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'gradient-button'
                }`}
              >
                {purchasing ? (
                  <span>
                    {purchaseStep === 'signing' ? 'Awaiting Wallet Approval...' : 'Verifying on Horizon...'}
                  </span>
                ) : isSoldOut ? (
                  <span>Event Sold Out</span>
                ) : (
                  <span>Purchase for {event.ticketPrice} XLM</span>
                )}
              </button>
            )}

            <p className="text-[10px] text-center text-slate-500">
              Transactions settle directly on Stellar Testnet ledger via Freighter.
            </p>

          </div>
        </div>

      </div>

    </div>
  );
};
