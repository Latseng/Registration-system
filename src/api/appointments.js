import axios from "axios";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const baseURL = "https://registration-system-2gho.onrender.com/api"

axios.defaults.headers.common["x-api-key"] = APIKey;

export const getAppointments = async () => {
  try {
    const res = await axios.get(`${baseURL}/appointments`, {
    }); 
    return res.data;
  } catch (error) {
    console.error('[Get Appointments failed]: ', error);
  }
};

// export const createAppointment = async (payload) => {
//    const { date, time, doctor, patientId } = payload;
//    try {
//      const res = await axios.post(`${baseUrl}/appointment`, {
//        date,
//        time,
//        doctor,
//        patientId
//      });
//      return res.data;
//    } catch (error) {
//      console.error("[Create Appointment failed]: ", error);
//    }
// };

export const patchAppointment = () => {};

// export const deleteAppointment = async (id) => {
//   try {
//     await axios.delete(`${baseUrl}/appointment/${id}`);
    
//   } catch (error) {
//     console.error('[Delete Appointment failed]:', error);
//   }
// };
