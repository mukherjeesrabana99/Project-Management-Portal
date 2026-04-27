import api from "../../api/axios";

export const getUserProfile = async () => {
  try {
    const response = await api.get("/api/auth/profile");
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/api/auth/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put("/api/auth/profile/password", passwordData);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};
