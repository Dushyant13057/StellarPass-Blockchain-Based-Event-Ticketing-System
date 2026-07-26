import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    walletAddress: { type: String, required: true, index: true },
    transactionHash: { type: String, required: true, unique: true, index: true },
    pricePaid: { type: Number, required: true },
    status: { type: String, enum: ['VALID', 'USED', 'CANCELLED'], default: 'VALID' },
    purchaseDate: { type: Date, default: Date.now },
    usedAt: { type: Date },
    qrCode: { type: String, required: true }
  },
  { timestamps: true }
);

export const Ticket = mongoose.model('Ticket', ticketSchema);
