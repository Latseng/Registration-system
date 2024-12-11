import axios from "axios";
import Ajv from "ajv";
import schedulesByDoctorDataSchema from "./schema/getSchedulesByDoctor.json"
import appointmentsByDoctorScheduleIdDataSchema from "./schema/getAppointmentsByDoctorScheduleId.json"

const APIKey = "0rEx0X54ow3S6M7yp8hYS4PkOhRC2irQ";
const baseURL = "https://registration-system-2gho.onrender.com/api";

//使用Ajv驗證後端回傳的資料
const validateData = (data, schema) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    // 驗證失敗，回傳失敗原因
    console.error(validate.errors);
    return false;
  } else {
    // 驗證通過，可以準備使用資料並渲染到 UI 上
    return true;
  }
};

axios.defaults.headers.common["x-api-key"] = APIKey;

export const getSchedules = async (specialty) => {
  try {
    const res = await axios.get(
      `${baseURL}/doctor-schedules/schedules-by-specialty/${specialty}`, 
      {
      headers: {
        withCredentials: true,
      },
    }
    );
    return res.data.data
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const getSchedulesByDoctor = async (id) => {
  try {
    const res = await axios.get(
      `${baseURL}/doctor-schedules/schedules-by-doctor/${id}`,
      {
        headers: {
          withCredentials: true,
        },
      }
    );
   //驗證後端回傳的資料是否符合schema
   const isDataValid = validateData(res.data, schedulesByDoctorDataSchema)
   if(isDataValid) {
    return res.data.data;
   }
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const getAppointmentsByDoctorScheduleId = async (id) => {
  try {
const res = await axios.get(`${baseURL}/doctor-schedules/${id}`);
const isDataValid = validateData(res.data, appointmentsByDoctorScheduleIdDataSchema);
if (isDataValid) {
  return res.data.data;
}

  } catch(error) {
    console.error(error);
  }
}

export const createSchedule = async (payload) => {
  const {doctorId, scheduleSlot, date, maxAppointments, status} = payload
  try {
    const res = await axios.post(
      `${baseURL}/doctor-schedules`,
      {
        doctorId,
        scheduleSlot,
        date,
        maxAppointments,
        status,
      },
      {
        withCredentials: true,
      }
    );
    return res.data.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};

export const deleteSchedule = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}/doctor-schedules/${id}`, 
    {
      headers: {
        withCredentials: true,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("[Get schedules failed]: ", error);
  }
};