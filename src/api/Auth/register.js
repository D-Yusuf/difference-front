import { instance } from "../index";
import { storeToken } from "../storage";
const register = async (email, firstName, lastName, password, role, image) => {
  try {
    const response = await instance.post("/users/register", {
      email,
      firstName,
      lastName,
      password,
      role,
      image,
    });
    await storeToken(response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export default register;
