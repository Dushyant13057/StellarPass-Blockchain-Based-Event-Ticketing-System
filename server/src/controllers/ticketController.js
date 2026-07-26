import { Ticket } from '../models/Ticket.js';
import { Event } from '../models/Event.js';
import { verifyStellarTransaction } from '../services/stellarService.js';
import QRCode from 'qrcode';

// Memory store fallback
let memoryTickets = [];

export const purchaseTicket = async (req, res) => {
  try {
    const { eventId, walletAddress, transactionHash, pricePaid } = req.body;

    if (!eventId || !walletAddress || !transactionHash) {
      return res.status(400).json({ success: false, message: 'Missing required purchase details (eventId, walletAddress, transactionHash)' });
    }

    // 1. Fetch Event
    let event = null;
    try {
      event = await Event.findById(eventId);
    } catch {
      // Memory check fallback
      const { getEvents } = await import('./eventController.js');
    }

    if (!event) {
      // Mock event object if database isn't populated
      event = {
        _id: eventId,
        title: 'Stellar Event Ticket',
        organizerWallet: 'GCDJ675FAOH5RMDZMBQA2EEDFRLMQVWWGDRLMWQ5WR55J6AOH5RMDZMB',
        ticketPrice: pricePaid || 10,
        availableTickets: 50
      };
    }

    if (event.availableTickets <= 0) {
      return res.status(400).json({ success: false, message: 'Event sold out! No tickets remaining.' });
    }

    // 2. Prevent Duplicate Transaction Ticket Creation
    let existingTicket = null;
    try {
      existingTicket = await Ticket.findOne({ transactionHash });
    } catch {
      existingTicket = memoryTickets.find(t => t.transactionHash === transactionHash);
    }

    if (existingTicket) {
      return res.status(400).json({ success: false, message: 'A ticket has already been issued for this transaction hash.', data: existingTicket });
    }

    // 3. Verify Transaction on Stellar Horizon Network
    const verification = await verifyStellarTransaction(transactionHash, event.organizerWallet, event.ticketPrice);
    if (!verification.success) {
      return res.status(400).json({ success: false, message: `Stellar Payment Verification Failed: ${verification.reason}` });
    }

    // 4. Generate Unique Ticket ID & Data payload
    const ticketId = `STP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrPayload = JSON.stringify({
      ticketId,
      eventId: event._id,
      txHash: transactionHash,
      wallet: walletAddress
    });

    // 5. Generate QR Code Base64 Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    // 6. Save Ticket to DB
    const newTicketData = {
      ticketId,
      eventId: event._id,
      walletAddress,
      transactionHash,
      pricePaid: Number(pricePaid || event.ticketPrice),
      status: 'VALID',
      purchaseDate: new Date(),
      qrCode: qrCodeDataUrl
    };

    let savedTicket = null;
    try {
      savedTicket = await Ticket.create(newTicketData);
      // Decrement available tickets count
      await Event.findByIdAndUpdate(eventId, { $inc: { availableTickets: -1 } });
    } catch {
      memoryTickets.unshift(newTicketData);
      savedTicket = newTicketData;
      if (event.availableTickets) event.availableTickets -= 1;
    }

    return res.status(201).json({
      success: true,
      message: 'Ticket purchased and verified successfully on Stellar Blockchain!',
      data: savedTicket
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    let tickets = [];

    try {
      let query = {};
      if (walletAddress) query.walletAddress = walletAddress;
      tickets = await Ticket.find(query).populate('eventId').sort({ createdAt: -1 });
    } catch {
      tickets = memoryTickets.filter(t => !walletAddress || t.walletAddress === walletAddress);
    }

    return res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    let ticket = null;
    try {
      ticket = await Ticket.findOne({ $or: [{ ticketId: id }, { _id: id }] }).populate('eventId');
    } catch {
      ticket = memoryTickets.find(t => t.ticketId === id || t._id === id);
    }

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    return res.json({ success: true, data: ticket });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyTicket = async (req, res) => {
  try {
    const { ticketId, rawQrData } = req.body;
    let targetTicketId = ticketId;

    if (rawQrData) {
      try {
        const parsed = JSON.parse(rawQrData);
        if (parsed.ticketId) targetTicketId = parsed.ticketId;
      } catch {
        targetTicketId = rawQrData;
      }
    }

    if (!targetTicketId) {
      return res.status(400).json({ success: false, message: 'Invalid QR Code payload or missing ticket ID' });
    }

    // Find ticket
    let ticket = null;
    try {
      ticket = await Ticket.findOne({ ticketId: targetTicketId }).populate('eventId');
    } catch {
      ticket = memoryTickets.find(t => t.ticketId === targetTicketId);
    }

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'INVALID TICKET: Ticket record not found in system database' });
    }

    // Verify status
    if (ticket.status === 'USED') {
      return res.status(400).json({
        success: false,
        status: 'USED',
        message: 'ENTRY ALREADY RECORDED: This ticket was already scanned and used for entry.',
        data: ticket
      });
    }

    if (ticket.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        status: 'CANCELLED',
        message: 'INVALID TICKET: Ticket has been cancelled or refunded.',
        data: ticket
      });
    }

    // Mark as USED
    try {
      ticket.status = 'USED';
      ticket.usedAt = new Date();
      await ticket.save();
    } catch {
      const idx = memoryTickets.findIndex(t => t.ticketId === targetTicketId);
      if (idx !== -1) {
        memoryTickets[idx].status = 'USED';
        memoryTickets[idx].usedAt = new Date();
        ticket = memoryTickets[idx];
      }
    }

    return res.json({
      success: true,
      status: 'VALID',
      message: 'ENTRY ALLOWED: Valid StellarPass Ticket! Entry granted.',
      data: ticket
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
