import instance from "./index";

export const getProfile = async () => {
  try {
    const response = await instance.get(`/auth/profile`);
    return response.data;
  } catch (error) {
    return error
  }
};
export const updateProfile = async (userInfo) => {
  try {
    console.log(userInfo)
    const formData = new FormData();
    for(let key in userInfo) {
      if(key=== 'image') {
        formData.append('image', {
          name: "image.jpg",
          type: "image/jpeg",
          uri: userInfo.image,
        });
      }else{
        formData.append(key, userInfo[key]);

      }
    }
  
    console.log(formData);
    const response = await instance.put(`/auth/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });; // Use userId in the URL

    return response.data;
  } catch (error) {
    return error
  }
};
