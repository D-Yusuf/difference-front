import instance from "./index";

export const getCategory = async (categoryId) => {
  try {
    const response = await instance.get(`/categories/${categoryId}`);
    console.log("Category API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};
