import axios from "axios";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const baseURL = "https://registration-system-2gho.onrender.com/api"

axios.defaults.headers.common["x-api-key"] = APIKey;

export const getAppointments = async (payload) => {
  const {idNumber, birthDate, recaptchaResponse} = payload
  try {
    const res = await axios.post(`${baseURL}/appointments/by-patient`, {
      idNumber,
      birthDate,
      recaptchaResponse,
    });
    return res.data;
  } catch (error) {
    console.error('[Get Appointments failed]: ', error);
    return error.response;
    
  }
};

export const createAppointment = async (payload) => {
   const { idNumber, birthDate, recaptchaResponse, doctorScheduleId } = payload;
   try {
     const res = await axios.post(`${baseURL}/appointments`, {
       idNumber,
       birthDate,
       recaptchaResponse,
       doctorScheduleId,
     });
     return res.data;
   } catch (error) {
     console.error(
       "[Create Appointment failed]: ",
       error
     );
     return error.response.message;
   }
};

export const createFirstAppointment = async (payload) => {
  const {
    idNumber,
    birthDate,
    recaptchaResponse,
    doctorScheduleId,
    name,
    contactInfo,
  } = payload;
  try {
    const res = await axios.post(`${baseURL}/appointments/first-visit`, {
      idNumber,
      birthDate,
      recaptchaResponse,
      doctorScheduleId,
      name,
      contactInfo,
    });
    console.log(res.data);
    
    return res.data;
  } catch (error) {
    console.error("[Create Appointment failed]: ", error);
  }
};

export const cancelAppointment = async (id) => {
  try {
    const res = await axios.put(`${baseURL}/appointments/${id}`, {
      status: "CANCELED",
    });
    
 return res
  } catch(error) {
    console.error("[Cancel Appointment failed]: ", error);
  }
};

export const deleteAppointment = async (id) => {
  try {
   const res = await axios.delete(`${baseURL}/appointments/${id}`);
    return res.data
  } catch (error) {
    console.error('[Delete Appointment failed]:', error);
  }
};
