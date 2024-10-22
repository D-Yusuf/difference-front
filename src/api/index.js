import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://192.168.2.235:8000/api", // Replace with your actual API base URL
});

export default apiClient;

//"http://192.168.2.235:8000/api"
