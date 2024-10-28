import axios from "axios";
import { getToken } from "./storage";

<<<<<<< HEAD
const BASE_URL = "http://192.168.2.58:8000/";
=======

const BASE_URL = "http://192.168.9.103:8000/";

>>>>>>> f2f2694b7cf7569eba32696bb3bea74cc6156933

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
