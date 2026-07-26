import { Event } from '../models/Event.js';
import { User } from '../models/User.js';

// In-Memory store fallback if Mongoose is disconnected during local preview
let memoryEvents = [
  {
    _id: '66a1b2c3d4e5f67890123451',
    title: 'Stellar Developer Summit 2026',
    description: 'Join developers, builders, and ecosystem leaders for 3 days of deep-tech talks, workshops, and networking centered around Smart Contracts on Soroban and Cross-Border Stellar Payments.',
    venue: 'Convention Center, San Francisco & Online',
    category: 'Tech & Crypto',
    date: '2026-09-15',
    time: '09:00 AM PST',
    ticketPrice: 25,
    bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizerId: '66a1b2c3d4e5f67890123400',
    organizerName: 'Stellar Foundation Community',
    organizerWallet: 'GAUM62OKQLHHAGXYWOGDLCSGTNJLQ6OAVWUAUXRCPTEUQV22LQRO4GUF',
    availableTickets: 142,
    totalTickets: 200,
    status: 'published'
  },
  {
    _id: '66a1b2c3d4e5f67890123452',
    title: 'Web3 Future Music & Arts Festival',
    description: 'An immersive music and digital art experience where NFT ticket holders get exclusive VIP backstage lounge access and direct artist token rewards.',
    venue: 'Crypto Arena, Los Angeles',
    category: 'Music & Arts',
    date: '2026-10-20',
    time: '06:00 PM PST',
    ticketPrice: 50,
    bannerImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizerId: '66a1b2c3d4e5f67890123400',
    organizerName: 'CyberPulse Events',
    organizerWallet: 'GAUM62OKQLHHAGXYWOGDLCSGTNJLQ6OAVWUAUXRCPTEUQV22LQRO4GUF',
    availableTickets: 88,
    totalTickets: 300,
    status: 'published'
  },
  {
    _id: '66a1b2c3d4e5f67890123453',
    title: 'Global DeFi & Fintech Hackathon',
    description: '48-hour global hackathon building cross-border remittance solutions and micro-lending protocols with low fees on Stellar Horizon.',
    venue: 'Tech Hub Auditorium, New York',
    category: 'Hackathon',
    date: '2026-11-05',
    time: '10:00 AM EST',
    ticketPrice: 10,
    bannerImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    organizerId: '66a1b2c3d4e5f67890123400',
    organizerName: 'Fintech Alliance',
    organizerWallet: 'GAUM62OKQLHHAGXYWOGDLCSGTNJLQ6OAVWUAUXRCPTEUQV22LQRO4GUF',
    availableTickets: 45,
    totalTickets: 100,
    status: 'published'
  }
];

export const getEvents = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    let events = [];
    try {
      events = await Event.find(query).sort({ createdAt: -1 });
    } catch {
      events = memoryEvents.filter(e => {
        if (category && category !== 'All' && e.category !== category) return false;
        if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
    }
    return res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    let event = null;
    try {
      event = await Event.findById(id);
    } catch {
      event = memoryEvents.find(e => e._id === id);
    }

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, venue, category, date, time, ticketPrice, bannerImage, totalTickets, organizerWallet, organizerName } = req.body;
    
    if (!title || !description || !venue || !date || !time || ticketPrice === undefined || !totalTickets || !organizerWallet) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const newEventData = {
      _id: Date.now().toString(),
      title,
      description,
      venue,
      category: category || 'General',
      date,
      time,
      ticketPrice: Number(ticketPrice),
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      organizerId: '66a1b2c3d4e5f67890123400',
      organizerName: organizerName || 'Stellar Organizer',
      organizerWallet,
      availableTickets: Number(totalTickets),
      totalTickets: Number(totalTickets),
      status: 'published'
    };

    try {
      const created = await Event.create(newEventData);
      return res.status(201).json({ success: true, data: created });
    } catch {
      memoryEvents.unshift(newEventData);
      return res.status(201).json({ success: true, data: newEventData });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;
    try {
      updated = await Event.findByIdAndUpdate(id, req.body, { new: true });
    } catch {
      const idx = memoryEvents.findIndex(e => e._id === id);
      if (idx !== -1) {
        memoryEvents[idx] = { ...memoryEvents[idx], ...req.body };
        updated = memoryEvents[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Event.findByIdAndDelete(id);
    } catch {
      memoryEvents = memoryEvents.filter(e => e._id !== id);
    }
    return res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
