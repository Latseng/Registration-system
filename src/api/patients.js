import axios from "axios";

const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY;
axios.defaults.withCredentials = true;

export const getPatientById = async (CSRF_token) => {
  try {
    const res = await axios.get(`${baseURL}/patients/profile`,{
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
