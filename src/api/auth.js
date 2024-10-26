import instance from ".";
import { storeToken, removeToken } from "./storage";
export const login = async (email, password) => {
  try {
<<<<<<< HEAD
    const { data } = await instance.post("/auth/login", { email, password });
    await storeToken(data.token);
    alert(data.message);
  } catch (error) {
    return error.response.data.error;
=======
    const {data} = await instance.post("/auth/login", { email, password });
    console.log(email,password)
    await storeToken(data.token);
    console.log(data)
    return data
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return (error.response.data.message || 'Authentication failed');
    } else if (error.request) {
      // The request was made but no response was received
      return ('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      return ('Error setting up the request');
    }
    
>>>>>>> difference-front/invest
  }
};

export const register = async (userInfo) => {
  try {
    const formData = new FormData();
    for(let key in userInfo){
      if(key === "image"){
        formData.append("image", {
            name: "image.jpg",
            type: "image/jpeg",
            uri: userInfo.image,
          });
        
      }else{
        formData.append(key, userInfo[key])
      } 
    }
      const {data} = await instance.post("/auth/register", formData);
      await storeToken(data.token);
      return data;
  } catch (error) {
    return error.response.data.error;
  }
};

export const logout = async () => {
  await removeToken();
};
