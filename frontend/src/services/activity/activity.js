import api from "../../api/axios";

export const getActivityStats = async () => {
  try {
    const response = await api.get("/api/activity/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    throw error;
  }
};

export const getActivityTimeline = async (period = "day") => {
  try {
    const response = await api.get(`/api/activity/timeline?period=${period}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching activity timeline:", error);
    throw error;
  }
};

export const getActivityByUser = async () => {
  try {
    const response = await api.get("/api/activity/by-user");
    return response.data;
  } catch (error) {
    console.error("Error fetching activity by user:", error);
    throw error;
  }
};

export const getRecentActivity = async ({ limit = 10, startDate, endDate } = {}) => {
  try {
    const query = new URLSearchParams();
    if (limit) query.append("limit", limit);
    if (startDate) query.append("startDate", startDate);
    if (endDate) query.append("endDate", endDate);
    const response = await api.get(`/api/activity/recent?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    throw error;
  }
};