import React from 'react';
import { Ticket, Github, Twitter, Shield, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl gradient-button flex items-center justify-center">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white">StellarPass</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized event ticketing powered by Stellar Lumens (XLM) & Freighter wallet for guaranteed fraud-proof proof of entry.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="/events" className="hover:text-indigo-400 transition-colors">Browse Events</a></li>
              <li><a href="/my-tickets" className="hover:text-indigo-400 transition-colors">My Tickets</a></li>
              <li><a href="/organizer/dashboard" className="hover:text-indigo-400 transition-colors">Organizer Portal</a></li>
              <li><a href="/organizer/scan" className="hover:text-indigo-400 transition-colors">Scan Entry QR</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Stellar Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="https://freighter.app" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                  <span>Freighter Wallet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://stellar.expert/explorer/testnet" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                  <span>Stellar Expert Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://horizon-testnet.stellar.org" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-indigo-400 transition-colors">
                  <span>Horizon Testnet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Security & Verification</h4>
            <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
                <Shield className="w-4 h-4" />
                <span>Verified On-Chain</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Every ticket is minted upon Stellar Horizon payment confirmation with cryptographic QR validation.
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 StellarPass MVP. Built for Stellar Hackathon.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Testnet Faucet</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
