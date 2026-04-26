import axios from "../../api/axios";

export const getAllProjects = async () => {
  const response = await axios.get("/api/projects");
  return response.data;
};

export const createProject = async (projectData) => {
  const response = await axios.post("/api/projects", projectData);
  return response.data;
};

export const updateProjectStatus = async (projectId, status) => {
  const response = await axios.put(`/api/projects/${projectId}/status`, { status });
  return response.data;
};