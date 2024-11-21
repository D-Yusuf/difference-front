import instance, { BASE_URL } from "./index";

export const getUsers = async () => {
  const response = await instance.get("/users");
  return response.data;
};

export const getUser = async (userId) => {
  const response = await instance.get(`/users/${userId}`);
  return response.data;
};

export const getInventors = async () => {
  try {
    const response = await instance.get("/inventors");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getProfile = async () => {
  const response = await instance.get("/auth/profile");
  return response.data;
};
