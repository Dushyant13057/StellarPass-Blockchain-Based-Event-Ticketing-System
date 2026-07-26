import React, { useEffect, useState } from 'react';
import { fetchEvents, createEvent, deleteEvent } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { Loader } from '../components/UI';
import { Plus, Trash2, Calendar, MapPin, Ticket, DollarSign, Users, BarChart3, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrganizerDashboard = () => {
  const { walletAddress, showToast } = useWallet();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    category: 'Tech & Crypto',
    date: '2026-10-15',
    time: '10:00 AM PST',
    ticketPrice: 15,
    totalTickets: 100,
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'Stellar Pass Host'
  });

  const loadOrganizerEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchEvents();
      if (res.success) setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        organizerWallet: walletAddress || 'GCDJ675FAOH5RMDZMBQA2EEDFRLMQVWWGDRLMWQ5WR55J6AOH5RMDZMB'
      };
      const res = await createEvent(payload);
      if (res.success) {
        showToast('Event created successfully!', 'success');
        setShowCreateModal(false);
        loadOrganizerEvents();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await deleteEvent(id);
      if (res.success) {
        showToast('Event deleted successfully', 'info');
        loadOrganizerEvents();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // Analytics Metrics Calculation
  const totalEventsCount = events.length;
  const totalTicketsAvailable = events.reduce((acc, curr) => acc + (curr.totalTickets || 0), 0);
  const totalTicketsSold = events.reduce((acc, curr) => acc + ((curr.totalTickets || 0) - (curr.availableTickets || 0)), 0);
  const totalRevenueXlm = events.reduce((acc, curr) => acc + (((curr.totalTickets || 0) - (curr.availableTickets || 0)) * (curr.ticketPrice || 0)), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Organizer Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage events, track XLM ticket sales, and issue entry permissions.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/organizer/scan"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>Scan Attendees</span>
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="gradient-button px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-bold text-slate-400">Total Active Events</span>
            <Ticket className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">{totalEventsCount}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold text-slate-400">Tickets Sold</span>
            <Users className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">{totalTicketsSold}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold text-slate-400">Stellar Revenue (XLM)</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{totalRevenueXlm} XLM</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-pink-400">
            <span className="text-xs font-bold text-slate-400">Capacity Occupancy</span>
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-3xl font-black text-white">
            {totalTicketsAvailable > 0 ? Math.round((totalTicketsSold / totalTicketsAvailable) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Events Table / List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Your Managed Events</h2>
        </div>

        {loading ? (
          <Loader label="Loading events..." />
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No events created yet. Click "Create New Event" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Date & Venue</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Sales</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center space-x-3">
                      <img src={evt.bannerImage} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="block font-bold text-slate-100">{evt.title}</span>
                        <span className="text-[10px] text-slate-400">{evt.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-200">{evt.date}</p>
                      <p className="text-[10px] text-slate-400">{evt.venue}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-indigo-400">
                      {evt.ticketPrice} XLM
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-400">{evt.totalTickets - evt.availableTickets}</span>
                      <span className="text-slate-500"> / {evt.totalTickets}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(evt._id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-extrabold text-white">Create New Event</h2>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Tech & Crypto">Tech & Crypto</option>
                    <option value="Music & Arts">Music & Arts</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ticket Price (XLM)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Capacity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.totalTickets}
                    onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={formData.bannerImage}
                  onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-button px-6 py-2.5 rounded-xl font-bold"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
