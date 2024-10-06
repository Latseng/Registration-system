import axios from "axios";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = APIKey;

export const getDoctors = async () => {
  try {
    const res = await axios.get(`${baseURL}/doctors`);
    return res.data;
  } catch (error) {
    console.error("[Get doctors failed]: ", error);
  }
};

export const getDoctorById = async (id) => {
  try {
const res = await axios.get(`${baseURL}/doctors/${id}`);
return res.data.data
  } catch(error) {
console.error("[Get doctor by id failed]: ", error);
  }
}

export const createDoctor = () => {};

export const patchDoctor = () => {};

export const deleteDoctor = () => {};
