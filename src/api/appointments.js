import axios from "axios";

const baseURL = "https://registration-system-2gho.onrender.com/api";

axios.defaults.headers.common["x-api-key"] = import.meta.env.VITE_API_KEY;
axios.defaults.withCredentials = true;

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
  const {
    idNumber,
    birthDate,
    recaptchaResponse,
    CSRF_token,
    isAuthenticated,
  } = payload;
  //使用者已登入
  if (isAuthenticated) {
    try {
      const res = await axios.post(
        `${baseURL}/appointments/by-patient`,
        {
          recaptchaResponse,
        },
        { headers: { "x-csrf-Token": CSRF_token } }
      );
      return res.data;
    } catch (error) {
      console.error("[Get Appointments failed]: ", error);
      return error.response;
    }
  }
  //未註冊使用者
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
  const {
    recaptchaResponse,
    doctorScheduleId,
    idNumber,
    birthDate,
    CSRF_token,
    isAuthenticated,
  } = payload;
  // 如果使用者已登入
  if (isAuthenticated) {
    try {
      const res = await axios.post(
        `${baseURL}/appointments`,
        {
          recaptchaResponse,
          doctorScheduleId,
        },
        {
          headers: { "x-csrf-Token": CSRF_token },
        }
      );
      return res.data;
    } catch (error) {
      console.error("[Create Appointment failed]: ", error);
      return error.response.data.message;
    }
  }
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
  const { idNumber, birthDate, recaptchaResponse, doctorScheduleId, name } =
    payload;
  try {
    const res = await axios.post(`${baseURL}/appointments/first-visit`, {
      idNumber,
      birthDate,
      recaptchaResponse,
      doctorScheduleId,
      name,
    });
    return res.data;
  } catch (error) {
    console.error("[Create Appointment failed]: ", error);
  }
};

export const cancelAppointment = async (
  appointmentId,
  idNumber,
  birthDate,
  isAuthenticated,
  CSRF_token,
  recaptchaResponse
) => {
  if (isAuthenticated) {
    //登入後取消掛號
    try {
      
      
      const res = await axios.patch(
        `${baseURL}/appointments/${appointmentId}`,
        {},
        {
          headers: { "x-csrf-Token": CSRF_token },
        }
      );
      return res;
    } catch (error) {
      console.error("[Cancel Appointment failed]: ", error);
    }
  } else {
    //未登入取消掛號
    try {
      const res = await axios.patch(
        `${baseURL}/appointments/${appointmentId}`,
        {
          idNumber: idNumber,
          birthDate: birthDate,
          recaptchaResponse: recaptchaResponse
        }
      );
      return res;
    } catch (error) {
      console.error("[Cancel Appointment failed]: ", error);
    }
  }
};

// 取消掛號：管理者權限
export const modifyAppointment = async (id, CSRF_token) => {
  try {
    const res = await axios.put(
      `${baseURL}/appointments/${id}`,
      {
        status: "CANCELED",
      },
      {
        headers: { "x-csrf-Token": CSRF_token },
      }
    );
    return res;
  } catch (error) {
    console.error("[Cancel Appointment failed]: ", error);
  }
};

// 重新掛號：管理者權限
export const reCreateAppointment = async (id, CSRF_token) => {
  try {
    const res = await axios.put(
      `${baseURL}/appointments/${id}`,
      {
        status: "CONFIRMED",
      },
      {
        headers: { "x-csrf-Token": CSRF_token },
      }
    );
    return res;
  } catch (error) {
    console.error("[Cancel Appointment failed]: ", error);
  }
};

export const deleteAppointment = async (id, CSRF_token) => {
  try {
    const res = await axios.delete(`${baseURL}/appointments/${id}`, {
      headers: { "x-csrf-Token": CSRF_token },
    });
    return res;
  } catch (error) {
    console.error("[Delete Appointment failed]:", error);
  }
};
