import axios from "axios";
import { getToken } from "./storage";
<<<<<<< HEAD
const BASE_URL = "http://192.168.2.122:8000/";
=======

const BASE_URL = "http://192.168.77.226:8000/";


>>>>>>> difference-front/invest
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
