import express from 'express';
import { purchaseTicket, getTickets, getTicketById, verifyTicket } from '../controllers/ticketController.js';

const router = express.Router();

router.post('/purchase', purchaseTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/verify-ticket', verifyTicket);

export default router;
