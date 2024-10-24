import instance from "./index";

export const getProfile = async () => {
  try {
    const response = await instance.get(`/auth/profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateProfile = async (userInfo) => {
  // Accept userId
  try {
    const response = await instance.put(`/auth/profile/`, userInfo); // Use userId in the URL

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
