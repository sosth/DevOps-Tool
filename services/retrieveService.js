import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getRetrieve = async () => {
  const response = await axios.get(`${API_URL}/retrieve`);
  return response.data;
};

export const createRetrieve = async (retrieve) => {
  const response = await axios.post(`${API_URL}/retrieve`, retrieve);
  return response.data;
};

export const updateRetrieve = async (retrieveId, retrieve) => {
  const response = await axios.put(`${API_URL}/retrieve/${retrieveId}`, retrieve);
  return response.data;
};

export const deleteRetrieve = async (retrieveId) => {
  const response = await axios.delete(`${API_URL}/retrieve/${retrieveId}`);
  return response.data;
};
