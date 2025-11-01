import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const getDistricts = () => axios.get(`${API_BASE}/districts`);
export const getPerformance = (district) =>
  axios.get(`${API_BASE}/performance/${district}`);
