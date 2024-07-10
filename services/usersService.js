import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

export const updateUser = async (userId, user) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, user);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
};
