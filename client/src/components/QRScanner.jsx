import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanMessage, setScanMessage] = useState(null);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    setScanning(true);
    setScanMessage(null);
    try {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          if (onScanError) onScanError(errorMessage);
        }
      );
    } catch (err) {
      setScanMessage({ type: 'error', text: 'Camera access denied or device has no active camera.' });
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanSuccess(manualCode.trim());
      setManualCode('');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-400" />
            <span>Ticket QR Scanner</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Scan attendee's StellarPass QR code to verify validity on-chain.</p>
        </div>

        {!scanning ? (
          <button
            onClick={startScanner}
            className="gradient-button flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold"
          >
            <Camera className="w-4 h-4" />
            <span>Start Camera</span>
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Stop Camera</span>
          </button>
        )}
      </div>

      {/* QR Camera Preview Container */}
      <div className={`relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 min-h-[280px] flex items-center justify-center ${scanning ? 'block' : 'hidden'}`}>
        <div id="reader" className="w-full h-full"></div>
      </div>

      {scanMessage && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 ${scanMessage.type === 'error' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'}`}>
          {scanMessage.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          <span>{scanMessage.text}</span>
        </div>
      )}

      {/* Manual Input Fallback */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <label className="text-xs font-semibold text-slate-300 block">
          Manual Ticket ID / Scan Input Fallback
        </label>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. STP-17219900-4821 or raw QR JSON"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="gradient-button px-5 py-2.5 rounded-xl text-xs font-bold shrink-0"
          >
            Verify Code
          </button>
        </form>
      </div>

    </div>
  );
};
