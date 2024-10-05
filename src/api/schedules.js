import axios from "axios";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const baseURL = "https://registration-system-2gho.onrender.com/api";


axios.defaults.headers.common["x-api-key"] = APIKey;

export const getSchedules = async (specialty) => {
  try {
    const res = await axios.get(
      `${baseURL}/doctor-schedules/schedules-by-specialty/${specialty}`
    );
    return res.data.data
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

// const baseUrl = "http://localhost:3004";

// export const getSchedules = async () => {
//   try {
//     const res = await axios.get(`${baseUrl}/schedules`);
//     console.log(res.data);
//     return res.data;
//   } catch (error) {
//     console.error("[Get schedules failed]: ", error);
//   }
// };

export const createAppointment = () => {};

export const patchAppointment = () => {};

export const deleteAppointment = () => {};
