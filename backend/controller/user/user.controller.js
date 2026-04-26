
const userService = require("../../service/user/user.service");

exports.createUser = async (req, res) => {
  const result = await userService.createUser(req.body, req.user.id);
  res.json({ success: true, data: result });
};

exports.getUsers = async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
};

exports.updateUser = async (req, res) => {
  await userService.updateUser(req.params.id, req.body, req.user.id);
  res.json({ success: true });
};

exports.deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);
  res.json({ success: true });
};