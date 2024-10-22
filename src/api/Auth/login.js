import { instance } from "../index";
import { storeToken } from "../storage";

const login = async (email, password) => {
  try {
    const response = await instance.post("/users/login", { email, password });
    await storeToken(response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export default login;
