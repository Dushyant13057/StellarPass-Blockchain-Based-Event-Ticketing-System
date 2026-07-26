import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectFreighterWallet, checkFreighterInstalled } from '../services/stellar';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('stellarpass_wallet') || null);
  const [userRole, setUserRole] = useState(localStorage.getItem('stellarpass_role') || 'attendee');
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasFreighter, setHasFreighter] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    checkFreighterInstalled().then(setHasFreighter);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const wallet = await connectFreighterWallet();
      setWalletAddress(wallet.publicKey);
      localStorage.setItem('stellarpass_wallet', wallet.publicKey);
      showToast(`Connected Freighter Wallet: ${wallet.publicKey.substring(0, 4)}...${wallet.publicKey.substring(wallet.publicKey.length - 4)}`, 'success');
      return wallet.publicKey;
    } catch (error) {
      showToast(error.message || 'Failed to connect Freighter Wallet', 'error');
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('stellarpass_wallet');
    showToast('Disconnected Freighter Wallet', 'info');
  };

  const toggleRole = (role) => {
    setUserRole(role);
    localStorage.setItem('stellarpass_role', role);
    showToast(`Switched view to ${role.toUpperCase()} mode`, 'info');
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        userRole,
        isConnecting,
        hasFreighter,
        connectWallet,
        disconnectWallet,
        toggleRole,
        toast,
        showToast
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
