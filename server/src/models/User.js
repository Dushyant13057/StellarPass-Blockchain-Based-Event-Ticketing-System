import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    walletAddress: { type: String, required: true, unique: true, index: true },
    role: { type: String, enum: ['attendee', 'organizer'], default: 'attendee' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
