import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink, CheckCircle2, AlertCircle, Download, Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';

export const TicketCard = ({ ticket }) => {
  const event = ticket.eventId || {};
  const isUsed = ticket.status === 'USED';

  const downloadQR = () => {
    const canvas = document.getElementById(`qr-${ticket.ticketId}`);
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${ticket.ticketId}_stellarpass.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (ticket.qrCode) {
      const downloadLink = document.createElement("a");
      downloadLink.href = ticket.qrCode;
      downloadLink.download = `${ticket.ticketId}_stellarpass.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/40 transition-all duration-300 shadow-xl flex flex-col md:flex-row">
      
      {/* QR Code Section */}
      <div className="p-6 bg-slate-950/80 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800/80 shrink-0 md:w-64">
        <div className="bg-white p-3 rounded-2xl shadow-lg relative group">
          {ticket.qrCode ? (
            <img src={ticket.qrCode} alt="Ticket QR" className="w-36 h-36" />
          ) : (
            <QRCodeSVG
              id={`qr-${ticket.ticketId}`}
              value={JSON.stringify({ ticketId: ticket.ticketId, txHash: ticket.transactionHash })}
              size={144}
              level="H"
              includeMargin={false}
            />
          )}
          {isUsed && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-rose-400 font-extrabold text-xs">
              <AlertCircle className="w-6 h-6 mb-1" />
              <span>ENTRY USED</span>
            </div>
          )}
        </div>

        <p className="text-[11px] font-mono text-indigo-400 mt-3 font-semibold tracking-wider">
          {ticket.ticketId}
        </p>

        <button
          onClick={downloadQR}
          className="mt-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download QR</span>
        </button>
      </div>

      {/* Ticket Details Section */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
              Stellar Blockchain Pass
            </span>
            <span
              className={`flex items-center space-x-1 text-xs font-bold px-3 py-1 rounded-full ${
                isUsed
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isUsed ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{ticket.status}</span>
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white mt-3">{event.title || 'Stellar Event'}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{event.date ? `${event.date} • ${event.time}` : 'Event Date TBA'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{event.venue || 'Venue TBA'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TicketIcon className="w-4 h-4 text-indigo-400" />
              <span>Price Paid: {ticket.pricePaid || 0} XLM</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Purchased:</span>
              <span>{new Date(ticket.purchaseDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Blockchain TX info */}
        <div className="pt-4 border-t border-slate-800/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Stellar Transaction Hash</span>
            <p className="font-mono text-indigo-300 truncate max-w-xs">{ticket.transactionHash}</p>
          </div>

          <a
            href={`https://stellar.expert/explorer/testnet/tx/${ticket.transactionHash}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-colors shrink-0"
          >
            <span>Verify on Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
};
