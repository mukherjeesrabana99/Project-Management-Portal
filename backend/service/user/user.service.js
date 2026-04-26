// services/user.service.js
const userRepo = require("../../repository/user/user.repository");
const activityRepo = require("../../repository/activity/activity.repository");
const bcrypt = require("bcrypt");

exports.createUser = async (data, createdBy) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [result] = await userRepo.createUser({ ...data, password: hashedPassword });
  // Log activity
  await activityRepo.logActivity(createdBy, 'created user', 'user', result.insertId);
  return result;
};

exports.getUsers = async () => {
  const [rows] = await userRepo.getAllUsers();
  return rows;
};

exports.updateUser = async (id, data, updatedBy) => {
  await userRepo.updateUser(id, data);
  // Log activity
  await activityRepo.logActivity(updatedBy, 'updated user', 'user', id);
};

exports.deleteUser = async (id, deletedBy) => {
  await userRepo.deleteUser(id);
  // Log activity
  await activityRepo.logActivity(deletedBy, 'deleted user', 'user', id);
};