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
  try {
    const formData = new FormData();
    for(let key in userInfo) {
      if(key!== 'image') {
        formData.append(key, userInfo[key]);
      }
    }
  
      formData.append('image', {
        name: "image.jpg",
        type: "image/jpeg",
        uri: userInfo.image,
    });
    console.log(formData);
    const response = await instance.put(`/auth/profile`, formData); // Use userId in the URL

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
