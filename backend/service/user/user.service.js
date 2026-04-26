// services/user.service.js
const userRepo = require("../../repository/user/user.repository");
const activityRepo = require("../../repository/activity/activity.repository");
const bcrypt = require("bcrypt");
const db = require("../../config/database/db_connection");

const getRoleIdByName = async (roleName) => {
  const [rows] = await db.promise().query("SELECT id FROM roles WHERE name = ?", [roleName]);
  if (rows.length === 0) throw new Error(`Role '${roleName}' not found`);
  return rows[0].id;
};

exports.createUser = async (data, createdBy) => {
  const roleId = await getRoleIdByName(data.role);
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const [result] = await userRepo.createUser({
    ...data,
    password: hashedPassword,
    role_id: roleId
  });
  // Log activity
  await activityRepo.logActivity(createdBy, 'created user', 'user', result.insertId);
  return result;
};

exports.getUsers = async () => {
  const [rows] = await userRepo.getAllUsers();
  return rows;
};

exports.updateUser = async (id, data, updatedBy) => {
  if (data.role) {
    data.role_id = await getRoleIdByName(data.role);
    delete data.role;
  }
  await userRepo.updateUser(id, data);
  // Log activity
  await activityRepo.logActivity(updatedBy, 'updated user', 'user', id);
};

exports.deleteUser = async (id, deletedBy) => {
  await userRepo.deleteUser(id);
  // Log activity
  await activityRepo.logActivity(deletedBy, 'deleted user', 'user', id);
};