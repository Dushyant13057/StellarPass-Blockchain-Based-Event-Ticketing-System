import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    category: { type: String, default: 'Tech & Crypto' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    bannerImage: { type: String, required: true },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizerName: { type: String, required: true },
    organizerWallet: { type: String, required: true },
    availableTickets: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    status: { type: String, enum: ['draft', 'published', 'cancelled'], default: 'published' }
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
