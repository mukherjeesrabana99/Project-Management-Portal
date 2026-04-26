import axios from "../../api/axios";

export const getAllUsers = async () => {
  const response = await axios.get("/api/user");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post("/api/user", userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`/api/user/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`/api/user/${userId}`);
  return response.data;
};