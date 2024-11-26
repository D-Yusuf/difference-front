import instance from "./index";

export const createLivePitch = async (pitchData) => {
  try {
    const { data } = await instance.post("/live-pitch/token", {
      channelName: pitchData.channelName,
      uid: pitchData.uid,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLivePitches = async () => {
  try {
    const { data } = await instance.get("/live-pitch");
    return data;
  } catch (error) {
    throw error;
  }
};

export const endLivePitch = async (pitchId) => {
  try {
    const { data } = await instance.delete(`/live-pitch/${pitchId}`);
    return data;
  } catch (error) {
    throw error;
  }
};
