import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, CheckCircle2, ChevronDown, ShieldCheck } from 'lucide-react';

export const WalletButton = () => {
  const { walletAddress, connectWallet, disconnectWallet, isConnecting } = useWallet();

  if (walletAddress) {
    return (
      <div className="relative group">
        <button className="flex items-center space-x-2 bg-indigo-950/60 border border-indigo-500/30 hover:border-indigo-500/60 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-200 transition-all">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>{walletAddress.substring(0, 5)}...{walletAddress.substring(walletAddress.length - 4)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
        </button>

        <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="p-2 border-b border-slate-800 mb-2">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Connected Account</p>
            <p className="text-xs font-mono text-indigo-300 break-all mt-1">{walletAddress}</p>
          </div>
          <button
            onClick={disconnectWallet}
            className="w-full flex items-center space-x-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 p-2.5 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect Wallet</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="gradient-button flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide"
    >
      <Wallet className="w-4 h-4" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Freighter'}</span>
    </button>
  );
};
