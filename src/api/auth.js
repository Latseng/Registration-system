import axios from "axios";
import { baseURL } from "./config";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const patientAuthURL = baseURL + "/patients";
const adminAuthURL = baseURL + "/admins";

axios.defaults.headers.common["x-api-key"] = APIKey;
axios.defaults.withCredentials = true;

export const login = async ({ idNumber, password }) => {
  try {
    const { data } = await axios.post(
      `${patientAuthURL}/sign-in`,
      {
        idNumber,
        password,
      }
    );
    return data;
  } catch (error) {
    console.error("[Login Failed]:", error);
    return error.response.data.message
  }
};

export const thirdPartyLogin = async () => {
  try {
    window.location.href = `${patientAuthURL}/login/google`;
  } catch (error) {
    console.error("[Login Failed]:", error);
  }
};

export const adminLogin = async ({ account, password }) => {
  try {
    const { data } = await axios.post(
      `${adminAuthURL}/sign-in`,
      {
        account,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error("[Login Failed]:", error);
  }
};

export const CSRF_request = async () => {
  try {
    const res = await axios.get(`${baseURL}/csrf-token`);
    return res.data
    
  } catch (error) {
    console.error("請求失敗", error);
    
  }
}

export const logoutReqest = async () => {
  try {
    const { data } = await axios.post(`${baseURL}/sign-out`,
    {

    }, 
    {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("[Logout Failed]:", error);
  }
};
