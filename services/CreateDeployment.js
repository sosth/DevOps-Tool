// services/createDeployment.js

import axios from 'axios';

export const createDeployment = async (deploymentData) => {
  try {
    const response = await axios.post('/api/deployments/create', deploymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDeployments = async () => {
  try {
    const response = await axios.get('/api/deployments');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrganizations = async () => {
  try {
    const response = await axios.get('/connected-orgs');
    return response.data;
  } catch (error) {
    throw error;
  }
};