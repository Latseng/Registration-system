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

export const createSchedule = async (payload, adminToken) => {
  const {doctorId, scheduleSlot, date, maxAppointments, status} = payload
  try {
    const res = await axios.post(
      `${baseURL}/doctor-schedules`,
      {
        doctorId,
        scheduleSlot,
        date,
        maxAppointments,
        status,
      },
      {
        headers: {
          authorization: "Bearer " + adminToken,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const deleteSchedule = async (id, adminToken) => {
  try {
    const res = await axios.delete(
      `${baseURL}/doctor-schedules/${id}`,
      {
        headers: {
          authorization: "Bearer " + adminToken,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};