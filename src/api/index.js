import axios from "axios";
import { getToken } from "./storage";
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  // baseURL: "http://127.0.0.1:8000/api",
});
instance.interceptors.request.use(async (config)=>{
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
})
export default instance;
