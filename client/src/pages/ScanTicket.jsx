import React, { useState } from 'react';
import { verifyTicketApi } from '../services/api';
import { QRScanner } from '../components/QRScanner';
import { useWallet } from '../context/WalletContext';
import { CheckCircle2, AlertCircle, ShieldCheck, Ticket, User, Calendar, ExternalLink } from 'lucide-react';

export const ScanTicket = () => {
  const { showToast } = useWallet();
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleScanCode = async (scannedPayload) => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const res = await verifyTicketApi({ rawQrData: scannedPayload });
      setVerificationResult(res);

      if (res.success) {
        showToast('ENTRY ALLOWED: Valid StellarPass Ticket!', 'success');
      } else {
        showToast(res.message || 'Ticket verification failed', 'error');
      }
    } catch (err) {
      const errorData = err.response?.data;
      setVerificationResult(errorData || {
        success: false,
        status: 'INVALID',
        message: err.message || 'Verification Error'
      });
      showToast(err.response?.data?.message || 'Verification error', 'error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      <div>
        <h1 className="text-3xl font-black text-white">Organizer Gate Check-In</h1>
        <p className="text-xs text-slate-400 mt-1">Scan attendee QR pass or input ticket ID to verify Stellar Horizon payment hash and issue entry permission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Scanner Component */}
        <QRScanner onScanSuccess={handleScanCode} />

        {/* Verification Result Display */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Scan Result & Status</span>
          </h3>

          {verifying ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto"></div>
              <p className="text-xs text-slate-400 font-semibold">Verifying ticket against Stellar Horizon & database...</p>
            </div>
          ) : !verificationResult ? (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
              Waiting for camera scan or manual code input...
            </div>
          ) : verificationResult.success ? (
            /* VALID SUCCESS ENTRY */
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3 text-emerald-400">
                <CheckCircle2 className="w-8 h-8 shrink-0" />
                <div>
                  <h4 className="text-base font-extrabold">ENTRY ALLOWED</h4>
                  <p className="text-xs text-emerald-200">{verificationResult.message}</p>
                </div>
              </div>

              {verificationResult.data && (
                <div className="pt-4 border-t border-emerald-500/20 text-xs space-y-2 text-slate-200">
                  <p><span className="text-slate-400">Ticket ID:</span> <span className="font-mono text-emerald-300">{verificationResult.data.ticketId}</span></p>
                  <p><span className="text-slate-400">Attendee Wallet:</span> <span className="font-mono text-slate-300 break-all">{verificationResult.data.walletAddress}</span></p>
                  <p><span className="text-slate-400">Status:</span> <span className="font-bold text-emerald-400">USED (Entry Logged)</span></p>
                </div>
              )}
            </div>
          ) : (
            /* REJECTED / ALREADY USED TICKET */
            <div className="bg-rose-950/60 border border-rose-500/40 p-6 rounded-2xl space-y-4">
              <div className="flex items-center space-x-3 text-rose-400">
                <AlertCircle className="w-8 h-8 shrink-0" />
                <div>
                  <h4 className="text-base font-extrabold">ENTRY REJECTED</h4>
                  <p className="text-xs text-rose-200">{verificationResult.message}</p>
                </div>
              </div>

              {verificationResult.status === 'USED' && (
                <div className="p-3 bg-rose-900/40 rounded-xl text-[11px] text-rose-300 font-medium">
                  Entry Already Recorded! This ticket has already passed through entry scanning.
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
