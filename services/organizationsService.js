import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getOrganizations = async () => {
  const response = await axios.get(`${API_URL}/organizations`);
  return response.data;
};

export const createOrganization = async (organization) => {
  const response = await axios.post(`${API_URL}/organizations`, organization);
  return response.data;
};

export const updateOrganization = async (orgId, organization) => {
  const response = await axios.put(`${API_URL}/organizations/${orgId}`, organization);
  return response.data;
};

export const deleteOrganization = async (orgId) => {
  const response = await axios.delete(`${API_URL}/organizations/${orgId}`);
  return response.data;
};
