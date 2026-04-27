
const service = require("../../service/client/client.service");

exports.createClient = async (req, res) => {
  const data = await service.createClient(req.body, req.user.id);
  res.json(data);
};

exports.getClients = async (req, res) => {
  const data = await service.getClients();
  res.json(data);
};

exports.getClientProfile = async (req, res) => {
  if (!req.user.client_id) {
    return res.status(403).json({ success: false, error: "Not authorized as a client." });
  }

  const data = await service.getClientById(req.user.client_id);
  res.json({ success: true, client: data });
};

exports.updateClientProfile = async (req, res) => {
  if (!req.user.client_id) {
    return res.status(403).json({ success: false, error: "Not authorized as a client." });
  }

  await service.updateClient(req.user.client_id, req.body, req.user.id);
  res.json({ success: true, message: "Client profile updated successfully." });
};

exports.updateClient = async (req, res) => {
  await service.updateClient(req.params.id, req.body, req.user.id);
  res.json({ success: true });
};

exports.deleteClient = async (req, res) => {
  await service.deleteClient(req.params.id, req.user.id);
  res.json({ success: true });
};