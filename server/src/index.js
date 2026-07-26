import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import eventRoutes from './routes/eventRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'StellarPass Backend API',
    network: process.env.STELLAR_NETWORK || 'TESTNET',
    timestamp: new Date()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 StellarPass Server running on http://localhost:${PORT}`);
  console.log(`🌐 Stellar Horizon Network: ${process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org'}`);
  console.log(`==================================================\n`);
});
