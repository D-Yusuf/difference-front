import index from "./index";

export const getCategories = async () => {
  const { data } = await index.get("/categories");
  return data;
};

export const getOneCategory = async (id) => {
  const { data } = await index.get(`/categories/${id}`);
  return data;
};

export const createCategory = async (category) => {
  const { data } = await index.post("/categories", category);
  return data;
};
