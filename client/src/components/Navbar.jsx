import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletButton } from './WalletButton';
import { useWallet } from '../context/WalletContext';
import { Ticket, Calendar, QrCode, Shield, LayoutDashboard, Sparkles, UserCheck } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const { userRole, toggleRole } = useWallet();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Stellar<span className="gradient-text">Pass</span>
              </span>
              <span className="block text-[10px] tracking-wider text-slate-400 font-semibold uppercase">
                Stellar Blockchain Tickets
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <Link
              to="/events"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/events')
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Explore Events</span>
            </Link>

            <Link
              to="/my-tickets"
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive('/my-tickets')
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My Tickets</span>
            </Link>

            {userRole === 'organizer' && (
              <>
                <Link
                  to="/organizer/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/organizer/dashboard')
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Organizer Dashboard</span>
                </Link>

                <Link
                  to="/organizer/scan"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive('/organizer/scan')
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR Entry</span>
                </Link>
              </>
            )}
          </div>

          {/* Right Action Items & Wallet */}
          <div className="flex items-center space-x-3">
            {/* Role Switcher */}
            <button
              onClick={() => toggleRole(userRole === 'attendee' ? 'organizer' : 'attendee')}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-[11px] font-semibold text-slate-300 hover:border-slate-700 transition-colors"
              title="Toggle between Attendee and Organizer mode"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="capitalize">Role: {userRole}</span>
            </button>

            <WalletButton />
          </div>

        </div>
      </div>
    </nav>
  );
};
