import axios from 'axios'

const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY;

export const getSpecialties = async () => {
  try {
    const res = await axios.get(`${baseURL}/doctors/specialties`);
    return res;
  } catch (error) {
    console.error("[Get specialties failed]: ", error);
  }
};