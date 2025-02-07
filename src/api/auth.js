import axios from "axios";
import { baseURL } from "./config";

const patientAuthURL = baseURL + "/patients";
const adminAuthURL = baseURL + "/admins";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY
axios.defaults.withCredentials = true;

export const register = async (payload) => {
  try {
   const res = await axios.post(`${patientAuthURL}`, {
     idNumber: payload.idNumber,
     birthDate: payload.birthDate,
     name: payload.name,
     email: payload.email || null,
     password: payload.password,
   });
    return res.data
  } catch (error) {
    console.error("[Register Failed]:", error);
    return error.response.data.message;
  }
};

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

export const getEmail = async () => {
  try {
    const res = await axios.get(`${patientAuthURL}/pending-email`);
    return res.data
  } catch(error) {
    console.error("[Get Email Failed]:", error);
  }
}

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
     return error.response.data.message;
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
    const { data } = await axios.post(`${baseURL}/sign-out`);
    return data;
  } catch (error) {
    console.error("[Logout Failed]:", error);
  }
};

//browser API test

// fetch(
//       "https://registration-system-2gho.onrender.com/api/patients/pending-email", {
//           headers: {
//               "x-api-key": "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ"
//           },
//           credentials: 'include'
//       }
//     )
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`); // 檢查狀態碼
//         }
//         return response.json(); // 解析 JSON 格式的回應
//       })
//       .then((data) => {
//         console.log("Success:", data); // 成功取得資料
//         // 在這裡處理取得的資料
//       })
//       .catch((error) => {
//         console.error("Error:", error); // 處理錯誤
//       });