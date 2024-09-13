import axios from "axios";

const baseUrl = "http://localhost:3004";

export const getAppointment = async () => {
  try {
    const res = await axios.get(`${baseUrl}/appointment`);
    return res.data;
  } catch (error) {
    console.error('[Get Appointment failed]: ', error);
  }
};

export const createAppointment = async (payload) => {
   const { date, time, doctor, patientId } = payload;
   try {
     const res = await axios.post(`${baseUrl}/appointment`, {
       date,
       time,
       doctor,
       patientId
     });
     return res.data;
   } catch (error) {
     console.error("[Create Appointment failed]: ", error);
   }
};

export const patchAppointment = () => {};

export const deleteAppointment = () => {};
