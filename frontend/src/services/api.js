// frontend/src/services/api.js
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

export const fetchTraders = async () => {
  const response = await axios.get(`${API_BASE}/traders`);
  return response.data;
};

export const fetchTraderById = async (id) => {
  const response = await axios.get(`${API_BASE}/traders/${id}`);
  return response.data;
};

export const submitVote = async (traderId, formData) => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'multipart/form-data' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await axios.post(`${API_BASE}/traders/${traderId}/vote`, formData, { headers });
  return response.data;
};
