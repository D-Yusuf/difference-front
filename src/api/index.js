import axios from "axios";
const baseURL = "localhost:3000";

const instance = axios.create({
  baseURL: baseURL,
});

export { instance, baseURL };
