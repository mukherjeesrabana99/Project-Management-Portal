import axios from "../../api/axios";

export const getAllClients = async () => {
  const response = await axios.get("/api/client");
  const clients = response.data || [];
  return clients.map((client) => ({
    ...client,
    name: client.name ?? client.contact_person ?? client.company_name ?? "",
    company: client.company ?? client.company_name ?? "",
    email: client.email ?? "",
    phone: client.phone ?? "",
    address: client.address ?? "",
  }));
};

export const createClient = async (clientData) => {
  const response = await axios.post("/api/client", clientData);
  return response.data;
};

export const updateClient = async (clientId, clientData) => {
  const response = await axios.put(`/api/client/${clientId}`, clientData);
  return response.data;
};

export const deleteClient = async (clientId) => {
  const response = await axios.delete(`/api/client/${clientId}`);
  return response.data;
};