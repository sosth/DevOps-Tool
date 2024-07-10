import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
export const getRetrievedItems = async () => {
  const response = await axios.get(`${API_URL}/retrieveditems`);
  return response.data;
};

export const createRetrievedItem = async (retrievedItem) => {
  const response = await axios.post(`${API_URL}/retrieveditems`, retrievedItem);
  return response.data;
};

export const updateRetrievedItem = async (retrievedItemId, retrievedItem) => {
  const response = await axios.put(`${API_URL}/retrieveditems/${retrievedItemId}`, retrievedItem);
  return response.data;
};

export const deleteRetrievedItem = async (retrievedItemId) => {
  const response = await axios.delete(`${API_URL}/retrieveditems/${retrievedItemId}`);
  return response.data;
};
