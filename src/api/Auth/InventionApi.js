import apiClient from "../index"; // Ensure this path is correct

export const createInvention = async (data) => {
  try {
    const response = await apiClient.post("/inventions", data);
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export default { createInvention };
