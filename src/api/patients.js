import axios from "axios";

const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY;
axios.defaults.withCredentials = true;

export const getPatients = async (CSRF_token) => {
  try {
    const res = await axios.get(`${baseURL}/patients`, {
      headers: { "x-csrf-Token": CSRF_token },
    });
    return res.data;
  } catch (error) {
    console.error("[Get patients failed]: ", error);
  }
};

export const getPatientById = async (id, CSRF_token) => {
  try {
    const res = await axios.get(`${baseURL}/patients/${id}`, {
      headers: { "x-csrf-Token": CSRF_token },
    });
    return res.data;
  } catch (error) {
    console.error("[Get patient data failed]: ", error);
  }
};

export const modifyPatientDataById = async (id, payload, CSRF_token) => {
  try {
    const res = await axios.put(
      `${baseURL}/patients/${id}`,
      {
        editedBirthDate: payload.birthDate,
        editedName: payload.name,
        editedEmail: payload.contact,
      },
      {
        headers: { "x-csrf-Token": CSRF_token },
      }
    );
    return res.data;
  } catch (error) {
    console.error("[Modified patient data failed]: ", error);
  }
};

export const getAppointmentsByPatientId = async(id, CSRF_token) => {
  try {
    const res = await axios.get(`${baseURL}/appointments/by-patient-admin/${id}}`, {
      headers: {"x-csrf-Token": CSRF_token}
    });
    return res.data
  } catch(error) {
    console.error("[Get patient appointments failed]", error);
    return error.response.data.message
  }
};

export const deletePatientById = async (id, CSRF_token) => {
  try {
    const res = await axios.delete(`${baseURL}/patients/${id}`, {
      headers: { "x-csrf-Token": CSRF_token },
    });
    return res.data
  } catch (error) {
    console.error("[Delete patient data failed]: ", error);
  }
};