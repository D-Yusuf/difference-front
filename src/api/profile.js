import instance from "./index";

export const getProfile = async () => {
  try {
    const response = await instance.get(`/auth/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
