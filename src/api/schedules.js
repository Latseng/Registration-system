import axios from "axios";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = APIKey;

export const getSchedules = async (specialty) => {
  try {
    const res = await axios.get(
      `${baseURL}/doctor-schedules/schedules-by-specialty/${specialty}`, 
      {
      headers: {
        withCredentials: true,
      },
    }
    );
    return res.data.data
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const getSchedulesByDoctor = async (id) => {
  try {
    const res = await axios.get(
      `${baseURL}/doctor-schedules/schedules-by-doctor/${id}`,
      {
        headers: {
          withCredentials: true,
        },
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const createSchedule = async (payload) => {
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
        withCredentials: true,
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const deleteSchedule = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}/doctor-schedules/${id}`, 
    {
      headers: {
        withCredentials: true,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};