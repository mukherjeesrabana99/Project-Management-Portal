
const repo = require("../../repository/client/client.repository");
const activityRepo = require("../../repository/activity/activity.repository");

exports.createClient = async (data, createdBy) => {
  const [result] = await repo.createClient(data);
  // Log activity
  await activityRepo.logActivity(createdBy, 'created client', 'client', result.insertId);
  return result;
};

exports.getClients = async () => {
  const [clients] = await repo.getClients();
  return clients;
};

exports.getClientById = async (id) => {
  const [clients] = await repo.getClientById(id);
  return clients[0] || null;
};

exports.updateClient = async (id, data, updatedBy) => {
  await repo.updateClient(id, data);
  // Log activity
  await activityRepo.logActivity(updatedBy, 'updated client', 'client', id);
};

exports.deleteClient = async (id, deletedBy) => {
  await repo.deleteClient(id);
  // Log activity
  await activityRepo.logActivity(deletedBy, 'deleted client', 'client', id);
};