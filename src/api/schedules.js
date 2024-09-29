import axios from "axios";

const baseUrl = "http://localhost:3004";

export const getSchedules = async () => {
  try {
    const res = await axios.get(`${baseUrl}/schedules`);
    return res.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const createAppointment = () => {
  
};

export const patchAppointment = () => {};

export const deleteAppointment = () => {
  
};
