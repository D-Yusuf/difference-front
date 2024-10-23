import axios from "axios";
import { getToken } from "./storage";

const BASE_URL = "http://192.168.2.151:8000/api";

const instance = axios.create({
  baseURL: BASE_URL + "api",
});
instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default instance;
export { BASE_URL };
