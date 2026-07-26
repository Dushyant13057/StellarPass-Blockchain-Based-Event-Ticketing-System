import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Events API
export const fetchEvents = async (params) => {
  const res = await API.get('/events', { params });
  return res.data;
};

export const fetchEventById = async (id) => {
  const res = await API.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await API.post('/events', eventData);
  return res.data;
};

export const updateEvent = async (id, eventData) => {
  const res = await API.put(`/events/${id}`, eventData);
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await API.delete(`/events/${id}`);
  return res.data;
};

// Tickets API
export const purchaseTicketApi = async (purchaseData) => {
  const res = await API.post('/tickets/purchase', purchaseData);
  return res.data;
};

export const fetchMyTickets = async (walletAddress) => {
  const res = await API.get('/tickets', { params: { walletAddress } });
  return res.data;
};

export const fetchTicketById = async (id) => {
  const res = await API.get(`/tickets/${id}`);
  return res.data;
};

export const verifyTicketApi = async (verifyPayload) => {
  const res = await API.post('/tickets/verify-ticket', verifyPayload);
  return res.data;
};

export default API;
