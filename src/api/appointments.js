import axios from "axios";

const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY;

export const getAppointments = async () => {
  try {
    const res = await axios.get(`${baseURL}/appointments`);
    console.log(res);
  } catch (error) {
    console.error("[Get Appointments failed]: ", error);
    return error.response;
  }
};

export const getAppointmentsBypatient = async (payload) => {
  const { idNumber, birthDate, recaptchaResponse } = payload;
  //使用者已登入
  if (payload.isLogin) {
    try {
      const res = await axios.post(
        `${baseURL}/appointments/by-patient`,
        {
          recaptchaResponse,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      console.error("[Get Appointments failed]: ", error);
      return error.response;
    }
  }

  try {
    const res = await axios.post(`${baseURL}/appointments/by-patient`, {
      idNumber,
      birthDate,
      recaptchaResponse,
    });
    return res.data;
  } catch (error) {
    console.error("[Get Appointments failed]: ", error);
    return error.response;
  }
};

export const createAppointment = async (payload) => {
  // 如果使用者已登入
  if (payload.isLogin) {
    const { recaptchaResponse, doctorScheduleId } = payload;

    try {
      const res = await axios.post(
        `${baseURL}/appointments`,
        {
          recaptchaResponse,
          doctorScheduleId,
        },
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (error) {
      console.error("[Create Appointment failed]: ", error);
      return error.response.data.message;
    }
  }
  const { idNumber, birthDate, recaptchaResponse, doctorScheduleId } = payload;
  try {
    const res = await axios.post(`${baseURL}/appointments`, {
      idNumber,
      birthDate,
      recaptchaResponse,
      doctorScheduleId,
    });
    return res.data;
  } catch (error) {
    console.error("[Create Appointment failed]: ", error);
    return error.response.data.message;
  }
};

export const createFirstAppointment = async (payload) => {
  const {
    idNumber,
    birthDate,
    recaptchaResponse,
    doctorScheduleId,
    name,
    contactInfo,
  } = payload;
  try {
    const res = await axios.post(`${baseURL}/appointments/first-visit`, {
      idNumber,
      birthDate,
      recaptchaResponse,
      doctorScheduleId,
      name,
      contactInfo,
    });
    console.log(res.data);

    return res.data;
  } catch (error) {
    console.error("[Create Appointment failed]: ", error);
  }
};

export const cancelAppointment = async (id) => {
  try {
    const res = await axios.put(
      `${baseURL}/appointments/${id}`,
      {
        status: "CANCELED",
      },
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    console.error("[Cancel Appointment failed]: ", error);
  }
};

// 重新掛號：管理者權限
export const reCreateAppointment = async (id) => {
  try {
    const res = await axios.put(
      `${baseURL}/appointments/${id}`,
      {
        status: "CONFIRMED",
      },
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    console.error("[Cancel Appointment failed]: ", error);
  }
};

export const deleteAppointment = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}/appointments/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("[Delete Appointment failed]:", error);
  }
};
