import instance from "./index";

export const getProfile = async () => {
  try {
    console.log("get profile", response);
    const response = await instance.get(`/auth/profile`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getProfileById = async (userId) => {
  try {
    const response = await instance.get(`/users/${userId}`);
    console.log("Profile data received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (userInfo) => {
  try {
    const formData = new FormData();
    for (let key in userInfo) {
      if (key === "image") {
        formData.append("image", {
          name: "image.jpg",
          type: "image/jpeg",
          uri: userInfo.image,
        });
      } else if (key === "cv") {
        formData.append("cv", {
          name: "cv.pdf",
          type: "application/pdf",
          uri: userInfo.cv,
        });
      } else {
        formData.append(key, userInfo[key]);
      }
    }

    const response = await instance.put(`/auth/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
