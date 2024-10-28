import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";

const storeToken = async (token) => {
  try {
    console.log("token login",token);
  await setItemAsync("token", token);
  } catch (error) {
    console.log(error,"set token error")
  }
};

const getToken = async () => {
  try {
    const token = await getItemAsync("token");
    console.log(token);
    return token;
  } catch (error) {
    console.log(error, "get token error");
  }
};

const removeToken = async () => {
  try { 
    console.log("remove token");
    await deleteItemAsync("token");
  } catch (error) {
    console.log(error, "remove token error");
  }
};

export { storeToken, getToken, removeToken };
