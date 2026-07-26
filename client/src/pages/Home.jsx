import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/api';
import { EventCard } from '../components/EventCard';
import { ShieldCheck, Ticket, QrCode, Wallet, ArrowRight, Zap, Lock, Sparkles, CheckCircle2, Star } from 'lucide-react';

export const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents()
      .then((res) => {
        if (res.success) {
          setFeaturedEvents(res.data.slice(0, 3));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Built on Stellar Blockchain Horizon Testnet</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Secure Event Ticketing Powered by <span className="gradient-text">Stellar Blockchain</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Eliminate event ticket fraud, scalping, and fake passes. StellarPass issues cryptographically verified tickets directly linked to Stellar Lumens (XLM) payments on-chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/events"
              className="gradient-button px-8 py-4 rounded-2xl text-sm font-extrabold flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Ticket className="w-4 h-4" />
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/organizer/dashboard"
              className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors w-full sm:w-auto text-center"
            >
              Host an Event
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-2xl font-black text-white">0.0001 XLM</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Ultra-Low Transaction Fee</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-2xl font-black text-indigo-400">~3-5 Seconds</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Instant On-Chain Settlement</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-2xl font-black text-purple-400">100%</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Fraud-Proof QR Verification</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-md">
              <p className="text-2xl font-black text-pink-400">Freighter</p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Direct Non-Custodial Wallet</p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Blockchain Events</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Reserve your verifiable ticket using your Freighter wallet in seconds.</p>
          </div>
          <Link to="/events" className="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1">
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* HOW STELLARPASS WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How StellarPass Works</h2>
          <p className="text-xs sm:text-sm text-slate-400">Simple 4-step ticket purchase and entry verification sequence.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-lg">
              1
            </div>
            <h3 className="text-base font-bold text-white">Connect Freighter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect your non-custodial Freighter Wallet to browse and interact with events securely.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-extrabold text-lg">
              2
            </div>
            <h3 className="text-base font-bold text-white">Approve Payment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sign transaction in XLM. Payment is processed directly on the Stellar Horizon Testnet.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 font-extrabold text-lg">
              3
            </div>
            <h3 className="text-base font-bold text-white">Receive On-Chain Pass</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our API verifies Horizon transaction confirmation and issues your unique QR-code ticket.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg">
              4
            </div>
            <h3 className="text-base font-bold text-white">Scan & Enter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organizers scan QR code at venue gate. Ticket status updates to USED instantly to prevent re-use.
            </p>
          </div>
        </div>
      </section>

      {/* WHY BLOCKCHAIN BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Why Blockchain?</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Built for True Ownership & Zero Counterfeiting</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Legacy ticketing platforms suffer from secondary market scalping, duplicate PDF screenshot tickets, and heavy intermediary commissions. StellarPass solves this at protocol level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Cryptographic Proof</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ticket ownership is irrevocably bound to your Stellar transaction hash recorded on the public ledger.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
                <Zap className="w-4 h-4" />
                <span>Sub-Cent Transactions</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stellar processes payments at thousands of transactions per second for fractions of a penny.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-pink-300 font-bold text-sm">
                <QrCode className="w-4 h-4" />
                <span>One-Time Scan Entry</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organizers scan the QR code to grant entry and atomically flag the ticket as USED on server.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-black text-white">Ready to Host or Attend Next-Gen Events?</h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Connect your Freighter Wallet now and experience seamless, decentralized event access.
        </p>
        <div className="pt-2">
          <Link to="/events" className="gradient-button px-8 py-3.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2">
            <span>Explore Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
