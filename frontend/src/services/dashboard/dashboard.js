
import api from "../../api/axios";

export const getStats = async () => {
  try {
    const response = await api.get(
      `/api/dashboard/stats`,
     
    );

    return response.data;
  } catch (error) {
    console.error("Error during fetching stats:", error);
    throw error;
  }
};
