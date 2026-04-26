
const service = require("../../service/project/project.service");

exports.createProject = async (req, res) => {
  const result = await service.createProject(req.body, req.user.id);
  res.json({ success: true, data: result });
};

exports.getProjects = async (req, res) => {
  const data = await service.getProjects(req.user);
  res.json(data);
};

exports.updateStatus = async (req, res) => {
  await service.updateProjectStatus(
    req.params.id,
    req.body.status,
    req.user.id
  );
  res.json({ success: true });
};

