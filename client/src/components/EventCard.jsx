import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Ticket, ArrowRight, User } from 'lucide-react';

export const EventCard = ({ event }) => {
  const isSoldOut = event.availableTickets <= 0;

  return (
    <div className="group bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full">
      {/* Event Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/60 text-[11px] font-semibold text-indigo-300">
          {event.category || 'Tech & Crypto'}
        </div>
        <div className="absolute top-3 right-3 bg-indigo-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-indigo-500/40 text-xs font-bold text-white flex items-center gap-1">
          <span>{event.ticketPrice} XLM</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center space-x-2 text-slate-400">
              <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{event.organizerName || 'Stellar Organizer'}</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-1">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Remaining Seats</span>
            <span className={`text-xs font-bold ${isSoldOut ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isSoldOut ? 'Sold Out' : `${event.availableTickets} / ${event.totalTickets}`}
            </span>
          </div>

          <Link
            to={`/events/${event._id}`}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isSoldOut
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'gradient-button'
            }`}
          >
            <span>{isSoldOut ? 'Sold Out' : 'Buy Ticket'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
