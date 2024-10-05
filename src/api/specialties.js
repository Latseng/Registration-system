import axios from 'axios'

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = APIKey;

export const getSpecialties = async () => {
  try {
    const res = await axios.get(`${baseURL}/doctors/specialties`);
    return res.data.data;
  } catch (error) {
    console.error("[Get specialties failed]: ", error);
  }
};