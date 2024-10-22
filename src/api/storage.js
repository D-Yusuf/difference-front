import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";

const storeToken = async (token) => {
  await setItemAsync("token", token);
};

const getToken = async () => {
  return await getItemAsync("token");
};

const removeToken = async () => {
  await deleteItemAsync("token");
};

export { storeToken, getToken, removeToken };
