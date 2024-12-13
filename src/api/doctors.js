import axios from "axios";

const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY;

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

export const searchDoctors = async (keyword) => {
  try {
    const res = await axios.get(`${baseURL}/doctors/search-doctors?keyword=${keyword}`);
    return res.data
    
  } catch(error) {
    console.error("[Search doctors failed]: ", error);
    
  }
}

export const createDoctor = () => {};

export const patchDoctorById = async (id, payload) => {
  try {
    const res = await axios.put(`${baseURL}/doctors/${id}`, payload);
    return res.data.status;
  } catch (error) {
    console.error("[Update doctorInfo by id failed]: ", error);
  }
};

export const deleteDoctorById = async (id) => {
  try {
    console.log(typeof id);
    const res = await axios.delete(`${baseURL}/doctors/${id}`);
    return res.data.status;
  } catch (error) {
    console.error("[Delete doctor by id failed]: ", error);
  }
};