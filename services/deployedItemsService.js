import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getDeployedItems = async () => {
  const response = await axios.get(`${API_URL}/deployeditems`);
  return response.data;
};

export const createDeployedItem = async (deployedItem) => {
  const response = await axios.post(`${API_URL}/deployeditems`, deployedItem);
  return response.data;
};

export const updateDeployedItem = async (deployedItemId, deployedItem) => {
  const response = await axios.put(`${API_URL}/deployeditems/${deployedItemId}`, deployedItem);
  return response.data;
};

export const deleteDeployedItem = async (deployedItemId) => {
  const response = await axios.delete(`${API_URL}/deployeditems/${deployedItemId}`);
  return response.data;
};
