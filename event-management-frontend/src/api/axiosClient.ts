import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
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
