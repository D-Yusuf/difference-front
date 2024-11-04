import instance from "./index"; // Ensure this path is correct
import { BASE_URL } from "../api"; // Adjust the path as needed

export const createInvention = async (inventionData) => {
  try {
    const formData = new FormData();
    for (let key in inventionData) {
      if (key !== "images" && key !== "documents")
        formData.append(key, inventionData[key]);
    }
    // Append each image file individually
    if (inventionData.images) {
      inventionData.images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          type: "image/jpeg",
          name: `image${index}.jpg`,
        });
      });
    }
    // Append documents if they exist
    if (inventionData.documents) {
      inventionData.documents.forEach((document, index) => {
        console.log("document", index, document);
        formData.append("documents", {
          uri: document.uri,
          type: document.mimeType,
          name: `document${index}.pdf`,
        });
      });
    }
    const { data } = await instance.post("/inventions", formData, {
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
    const { data } = await instance.get(`/inventions/user/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching inventions:", error);
    throw error;
  }
};
export const getInvention = async (inventionId) => {
  try {
    const { data } = await instance.get(`/inventions/${inventionId}`);
    return data;
  } catch (error) {
    console.error("Error fetching invention:", error);
    throw error;
  }
};

export const getInventionById = async (inventionId) => {
  try {
    const { data } = await instance.get(`/inventions/${inventionId}`);
    return data;
  } catch (error) {
    throw error;
  }
}; //i know yusef i have 2 of these functions but its too late to change
export const getAllInventions = async () => {
  try {
    const { data } = await instance.get("/inventions");
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateInvention = async (inventionId, inventionData) => {
  try {
    console.log("Updating invention with data:", inventionData);
    const formData = new FormData();

    // Append basic fields (similar to createInvention)
    for (let key in inventionData) {
      if (key !== "images" && key !== "documents") {
        formData.append(key, inventionData[key]);
      }
    }

    // Handle images
    if (inventionData.images) {
      inventionData.images.forEach((image, index) => {
        // If it's an existing image (just a path string)
        if (typeof image === 'string') {
          formData.append("images", image);
        } else {
          // If it's a new image object
          formData.append("images", {
            uri: image.uri,
            type: "image/jpeg",
            name: `image${index}.jpg`,
          });
        }
      });
    }

    // Handle documents
    if (inventionData.documents) {
      inventionData.documents.forEach((document, index) => {
        if (typeof document === 'string') {
          formData.append("documents", document);
        } else {
          formData.append("documents", {
            uri: document.uri,
            type: document.mimeType,
            name: `document${index}.pdf`,
          });
        }
      });
    }

    const { data } = await instance.put(
      `/inventions/${inventionId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error in updateInvention:", error.response?.data || error);
    throw error;
  }
};

export const toggleLikeInvention = async (inventionId) => {
  try {
    const { data } = await instance.put(`/inventions/${inventionId}/like`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const toggleInterestedInvention = async (inventionId) => {
  try {
    const { data } = await instance.put(
      `/inventions/${inventionId}/interested`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const incrementInventionViews = async (inventionId) => {
  try {
    const { data } = await instance.put(`/inventions/${inventionId}/views`);
    return data;
  } catch (error) {
    throw error;
  }
};
