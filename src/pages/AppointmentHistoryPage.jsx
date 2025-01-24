import { Layout, Form, Input, Button, Modal, List, Table, message } from "antd";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getPreviousAppointmentsBypatient,
} from "../api/appointments";
import { FaRegUser } from "react-icons/fa";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { GrStatusGood } from "react-icons/gr";
import LoginButton from "../components/LoginButton";
import { useNavigate, Link } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useRWD from "../hooks/useRWD";
import { setLogin } from "../store/authSlice";
import { CSRF_request } from "../api/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { idNumberValidation } from "../helper/idNumber";
import { useLocation } from "react-router-dom";

const { Content } = Layout;
const { confirm } = Modal;
dayjs.extend(customParseFormat);

const AppointmentHistoryPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
  const { isAuthenticated, role, CSRF_token } = useSelector(
    (state) => state.auth
  );
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [isReadable, setIsReadable] = useState(false);
  const [recaptcha, setRecaptcha] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");
  //使用者未登入，操作用到的暫存身份資料
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const location = useLocation();
  const isDesktop = useRWD();

  const isCallGoogle = useRef(false);

  const handleClick = (value) => {
    console.log(value);
    
  }

  const columns = [
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "時段",
      dataIndex: "scheduleSlot",
      key: "scheduleSlot",
    },
    {
      title: "科別",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "醫師",
      key: "doctorName",
      dataIndex: "doctorName",
    },
    {
      render: (_, record) =>
         (
          <Button onClick={() => handleClick(record)}>
            快速掛號
          </Button>
        )
    },
  ];
  const tableData = appointments
    .map((item) => ({
      key: item.appointmentId,
      appointmentId: item.appointmentId,
      doctorScheduleId: item.doctorScheduleId,
      date: item.date,
      scheduleSlot: item.scheduleSlot,
      specialty: item.doctorSpecialty,
      doctorName: item.doctorName,
      consultationNumber: item.consultationNumber,
      status: item.status === "CANCELED" ? "已取消" : "已掛號",
    }))

  const getAppointmentsDataAsync = useCallback(
    async (data) => {
      try {
        setIsPageLoading(true);
        const patientAppointments = await getPreviousAppointmentsBypatient(
          data
        );
        if (patientAppointments.status === "success") {
          const weekDay = ["日", "一", "二", "三", "四", "五", "六"];
          const organizedAppointments = patientAppointments.data.map((p) => {
            const formattedDate =
              dayjs(p.date).format("M/D") +
              "（" +
              weekDay[dayjs(p.date).day()] +
              "）";
            const formattedSlot = p.scheduleSlot.includes("Morning")
              ? "上午診"
              : "下午診";
            return { ...p, date: formattedDate, scheduleSlot: formattedSlot };
          });

          setRequestData(data);
          setAppointments(organizedAppointments);

          setIsLoading(false);
          setIsPageLoading(false);
        }
        //持有帳號的使用者必須登入才能查看掛號
        if (patientAppointments.data.message?.includes("登入")) {
          setIsLoading(false);
          confirm({
            title: "須先登入",
            icon: <ExclamationCircleFilled />,
            content: "您已有帳號，需要先登入才能使用本功能",
            okText: "前往登入",
            cancelText: "取消",
            onOk() {
              navigate("/login");
            },
            onCancel() {},
          });
          return;
        }
        //使用者沒有掛號過
        if (
          patientAppointments.data.message ===
          "No appointments found for this patient."
        ) {
          setIsLoading(false);
          setAppointments([]);
          setIsPageLoading(false);
          return;
        }
        setIsPageLoading(false);
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  //處理查詢表單送出
  const handleFinish = async (values) => {
    if (recaptcha === "") {
      return setRecaptchaError("請驗證reCaptcha");
    }
    setIsLoading(true);
    const requestData = {
      idNumber: values.idNumber,
      birthDate: new Date(
        Date.UTC(values.year, values.month - 1, values.day)
      ).toISOString(),
      recaptchaResponse: recaptcha,
    };
    getAppointmentsDataAsync(requestData);
    setIsReadable(true);
    setIdNumber(values.idNumber);
    setBirthDate(
      new Date(
        Date.UTC(values.year, values.month - 1, values.day)
      ).toISOString()
    );
    setRecaptcha("");
  };

  const handlerecaptchaChange = (value) => {
    setRecaptcha(value);
    setRecaptchaError("");
  };

  useEffect(() => {
    //如果第三方登入驗證成功的話，存入登入狀態資料
    const queryString = window.location.search; //第三方登入狀態判斷
    if (queryString.includes("true") && !isCallGoogle.value) {
      const getCSRFtokenAsync = async () => {
        try {
          const res = await CSRF_request();
          dispatch(
            setLogin({
              user: { account: "google account" },
              role: "patient",
              CSRF_token: res.data.csrfToken,
              expiresIn: 3600, //設定登入時效為一小時 = 3600秒
            })
          );
          isCallGoogle.value = true;
        } catch (error) {
          console.error(error);
        }
      };
      getCSRFtokenAsync();
    }
  }, [dispatch]);

  useEffect(() => {
    //檢查使用者是否為登入狀態
    if (isAuthenticated && role === "patient") {
      setIsReadable(true);
      setIsPageLoading(true);
      const queryPayload = {
        isAuthenticated,
        CSRF_token,
      };
      getAppointmentsDataAsync(queryPayload);
    }
  }, [CSRF_token, getAppointmentsDataAsync, isAuthenticated, role]);

  useEffect(() => {
    //新掛號建立後，病患可立即查看
    const queryString = window.location.search;
    if (queryString.includes("appointmentStatus=success")) {
      //是否為掛號成功的未登入使用者
      if (location.state) {
        getAppointmentsDataAsync(location.state.requestPayload);
      }
      setIsPageLoading(true);
      setIsAppointmentSuccess(true);
      setIsReadable(true);
    }
  }, [getAppointmentsDataAsync, location.state]);

  return (
    <>
      {contextHolder}
      {isDesktop && <LoginButton />}
      <Content className="bg-gray-100 p-4">
        {isPageLoading ? (
          <List loading={isPageLoading}></List>
        ) : //使用者是否登入或者剛建立新掛號
        isReadable ? (
          //使用者是否有掛號資料
          appointments.length > 0 ? (
            <>
              <h1 className="text-2xl mb-6">您的歷史掛號紀錄</h1>
              {isAppointmentSuccess && (
                <div className="flex items-center justify-center text-lg">
                  <GrStatusGood className="text-green-500" />
                  <span>掛號成功</span>
                </div>
              )}
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={tableData} />
              </div>
            </>
          ) : (
            <h1 className="text-2xl mb-6">查無掛號紀錄</h1>
          )
        ) : (
          <Form
            form={form}
            name="login"
            className="mx-auto mt-8 text-center rounded-2xl md:w-1/2 bg-white p-4"
            initialValues={{
              remember: true,
            }}
            onFinish={handleFinish}
          >
            <h1 className="text-2xl mb-6">歷史掛號紀錄查詢</h1>
            <Form.Item
              label="身份證字號"
              name="idNumber"
              validateTrigger="onBlur"
              rules={[
                {
                  required: true,
                  message: "請輸入身份證字號",
                },

                {
                  validator: idNumberValidation,
                },
              ]}
            >
              <Input prefix={<FaRegUser />} placeholder="身份證字號" />
            </Form.Item>
            <Form.Item label="生日">
              <DatePicker form={form}></DatePicker>
            </Form.Item>
            <ReCAPTCHA
              className="my-4"
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handlerecaptchaChange}
            />
            {recaptchaError !== "" && (
              <span className="text-red-500">{recaptchaError}</span>
            )}
            <Form.Item>
              <Button
                block
                loading={isLoading}
                className="mb-4"
                type="primary"
                htmlType="submit"
              >
                查詢
              </Button>
              或
              <Link
                to="/register"
                className="text-base mx-2 font-medium hover:text-mainColorLight"
              >
                立即註冊
              </Link>
              以方便您利用本系統
            </Form.Item>
          </Form>
        )}
      </Content>
    </>
  );
};

export default AppointmentHistoryPage;
