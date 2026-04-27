import api from "../../api/axios";

export const createProject= async (projectData) => {
  try {
    const response = await api.post("/api/project", projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const getClientProjects = async () => {
  try {
    const response = await api.get("/api/project");
    return response.data;
  } catch (error) {
    console.error("Error fetching client projects:", error);
    throw error;
  }
};

export const getAssignedUserProjects = async () => {
  try {
    const response = await api.get("/api/project/assigned");
    return response.data;
  } catch (error) {
    console.error("Error fetching assigned user projects:", error);
    throw error;
  }
};

export const getClientProfile = async () => {
  try {
    const response = await api.get("/api/client/me");
    return response.data.client;
  } catch (error) {
    console.error("Error fetching client profile:", error);
    throw error;
  }
};

export const updateClientProfile = async (clientData) => {
  try {
    const response = await api.put("/api/client/me", clientData);
    return response.data;
  } catch (error) {
    console.error("Error updating client profile:", error);
    throw error;
  }
};

export const updateClientProjectStatus = async (projectId, status) => {
  try {
    const response = await api.put(`/api/project/${projectId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating project status:", error);
    throw error;
  }
};
