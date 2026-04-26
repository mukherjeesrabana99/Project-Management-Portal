// services/user.service.js
const userRepo = require("../repositories/user/user.repository");
const bcrypt = require("bcrypt");

exports.createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return userRepo.createUser({ ...data, password: hashedPassword });
};

exports.getUsers = async () => {
  const [rows] = await userRepo.getAllUsers();
  return rows;
};

exports.updateUser = async (id, data) => {
  return userRepo.updateUser(id, data);
};

exports.deleteUser = async (id) => {
  return userRepo.deleteUser(id);
};