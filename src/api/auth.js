import instance from ".";
import { storeToken, removeToken } from "./storage";
import { jwtDecode } from "jwt-decode";

export const login = async (email, password) => {
  try {
    const { data } = await instance.post("/auth/login", { email, password });
    console.log(data.token);
    await storeToken(data.token);
    const decoded = jwtDecode(data.token);
    return data;
  } catch (error) {
    console.log(error);
    return error.response.data.error;
  }
};

export const register = async (userInfo) => {
  try {
    const formData = new FormData();
    for (let key in userInfo) {
      if (key === "image") {
        formData.append("image", {
          name: "image.jpg",
          type: "image/jpeg",
          uri: userInfo.image,
        });
      } else {
        formData.append(key, userInfo[key]);
      }
    }
    const { data } = await instance.post("/auth/register", formData);
    await storeToken(data.token);
    return data;
  } catch (error) {
    return error.response.data.error;
  }
};

export const logout = async () => {
  await removeToken();
};
