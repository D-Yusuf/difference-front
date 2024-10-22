import instance from "./index";

export const createInvention = async (data) => {
  try {
    const formData = new FormData();
    for (let key in data) {
      if (key !== "images") formData.append(key, data[key]);
    }

    // Handle multiple images as a single array
    const imagesArray = data.images.map((image, index) => ({
      uri: image.uri,
      type: "image/jpeg",
      name: `image${index}.jpg`,
    }));

    formData.append("images", JSON.stringify(imagesArray));

    console.log("formData", formData);
    const response = await instance.post("/inventions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export default { createInvention };
