
const service = require("../../service/client/client.service");

exports.createClient = async (req, res) => {
  const data = await service.createClient(req.body);
  res.json(data);
};

exports.getClients = async (req, res) => {
  const data = await service.createClient(req.body, req.user.id);
  res.json(data);
};

exports.updateClient = async (req, res) => {
  await service.updateClient(req.params.id, req.body, req.user.id);
  res.json({ success: true });
};

exports.deleteClient = async (req, res) => {
  await service.deleteClient(req.params.id, req.user.id);
  res.json({ success: true });
};