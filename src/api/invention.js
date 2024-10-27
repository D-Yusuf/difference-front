import index from "./index"; // Ensure this path is correct

export const createInvention = async (inventionData) => {
  try {
    const formData = new FormData();
    for (let key in inventionData) {
      if (key !== "images") formData.append(key, inventionData[key]);
    }
    // Append each image file individually
    inventionData.images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        type: "image/jpeg", // Adjust this if you need to support other image types
        name: `image${index}.jpg`,
      });
    });
    const { data } = await index.post("/inventions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getInventions = async (userId) => {
  try {
    const { data } = await index.get(`/inventions/user/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching inventions:", error);
    throw error;
  }
};
export const getInvention = async (inventionId) => {
  try {
    const { data } = await index.get(`/inventions/${inventionId}`);
    return data;
  } catch (error) {
    console.error("Error fetching invention:", error);
    throw error;
  }
};

export const getAllInventions = async () => {
  try {
    const { data } = await index.get("/inventions");
    return data;
  } catch (error) {
    throw error;
  }
};
