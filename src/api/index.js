import axios from "axios";
import { getToken } from "./storage";
import { io } from "socket.io-client";

const BASE_URL = "http://192.168.2.150:8000/";

const instance = axios.create({
  baseURL: BASE_URL + "api",
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token?.token}`;
  return config;
});

// Invention related invalidations
export const invalidateInventionQueries = (queryClient) => {
  queryClient.invalidateQueries(["inventions"]);
  queryClient.invalidateQueries(["profile"]);
};

// Order related invalidations
export const invalidateOrderQueries = (queryClient) => {
  queryClient.invalidateQueries(["orders"]);
  queryClient.invalidateQueries(["profile"]);
  queryClient.invalidateQueries(["inventions"]);
};

// Profile related invalidations
export const invalidateProfileQueries = (queryClient) => {
  queryClient.invalidateQueries(["profile"]);
  queryClient.invalidateQueries(["inventors"]);
};

export const socket = io("http://192.168.2.122:3000", {
  autoConnect: false,
});

export default instance;
export { BASE_URL };
