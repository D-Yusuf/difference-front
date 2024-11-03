import axios from "axios";
import instance, { BASE_URL } from "./index";

const getAllMessageRooms = async () => {
  try {
    const response = await instance.get(`/message-room`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};

const createMessageRoom = async (message) => {
  try {
    const response = await instance.post(`/message-room`, message);
    return response.data;
  } catch (error) {
    console.log("Error Creating a chat room", error);
    throw error;
  }
};

const getMessageRoomById = async (messageRoomId) => {
  try {
    const response = await instance.get(`/message-room/${messageRoomId}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching message room by id", error);
    throw error;
  }
};

export { getAllMessageRooms, createMessageRoom, getMessageRoomById };
