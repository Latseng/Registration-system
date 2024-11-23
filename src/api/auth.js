import axios from "axios";
import { baseURL } from "./config";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const patientAuthURL = baseURL + "/patients";
const adminAuthURL = baseURL + "/admins";

axios.defaults.headers.common["x-api-key"] = APIKey;

export const loginReqest = async ({ idNumber, password }) => {
  try {
    const { data } = await axios.post(`${patientAuthURL}/sign-in`, {
      idNumber,
      password,
    });
    const { token } = data.data;
    if (token) {
      return { success: true, ...data.data };
    }
    return data;
  } catch (error) {
    console.error("[Login Failed]:", error);
  }
};

export const thirdPartyLoginReqest = async () => {
  try {
    const response = await axios.get(`${patientAuthURL}/login/google`);
    console.log(response);
    
  } catch (error) {
    console.error("[Login Failed]:", error);
  }
};


export const adminLoginReqest = async ({ account, password }) => {
  try {
    const { data } = await axios.post(`${adminAuthURL}/sign-in`, {
      account,
      password,
      withCredentials: true,
    });
    const { token } = data.data;
    if (token) {
      return { success: true, ...data.data };
    }
    return data;
  } catch (error) {
    console.error("[Login Failed]:", error);
  }
};

export const logoutReqest = async () => {
  try {
    const { data } = await axios.post(`${baseURL}/sign-out`);
    console.log(data);
    
    return data;
  } catch (error) {
    console.error("[Logout Failed]:", error);
  }
};
