import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getDeployments = async () => {
  const response = await axios.get(`${API_URL}/deployments`);
  return response.data;
};

export const createDeployment = async (deployment) => {
  const response = await axios.post(`${API_URL}/deployments`, deployment);
  return response.data;
};

export const updateDeployment = async (deploymentId, deployment) => {
  const response = await axios.put(`${API_URL}/deployments/${deploymentId}`, deployment);
  return response.data;
};

export const deleteDeployment = async (deploymentId) => {
  const response = await axios.delete(`${API_URL}/deployments/${deploymentId}`);
  return response.data;
};
