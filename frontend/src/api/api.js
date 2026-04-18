import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://expense-tracker-bd7k.onrender.com";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default API;