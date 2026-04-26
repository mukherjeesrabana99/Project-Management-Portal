import axios from "axios";

export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};