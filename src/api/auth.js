import axios from "axios"
import { baseURL } from "./config";

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const authURL = baseURL + "/patients";

axios.defaults.headers.common["x-api-key"] = APIKey;

export const loginReqest = async ({idNumber, password})  => {
  try {
    const {data} = await axios.post(`${authURL}/sign-in`, {
      idNumber,
      password
    })
    const {token} = data.data
    if(token) {
      return { success: true, ...data.data}
    }
    return data
  } catch (error) {
    console.error("[Login Failed]:", error);
  }
}