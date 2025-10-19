import axios, { AxiosError } from "axios";

// ✅ Read the base URL from Vite env variables
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, 
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Network or Server Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
