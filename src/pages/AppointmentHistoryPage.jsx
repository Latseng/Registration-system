import { Layout, Form, Input, Button, Modal, List, Table } from "antd";
import { useState, useEffect, useCallback } from "react";
import { getPreviousAppointmentsBypatient } from "../api/appointments";
import { FaRegUser } from "react-icons/fa";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useSelector, useDispatch } from "react-redux";
import LoginButton from "../components/LoginButton";
import { useNavigate, Link } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useRWD from "../hooks/useRWD";
import ReCAPTCHA from "react-google-recaptcha";
import { idNumberValidation } from "../helper/idNumber";
import SelectedModal from "../components/SelectedModal";
import { getDoctorById } from "../api/doctors";
import { setTempUserData } from "../store/tempUserSlice";

const { Content } = Layout;
const { confirm } = Modal;
dayjs.extend(customParseFormat);

const AppointmentHistoryPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { isAuthenticated, role, CSRF_token } = useSelector(
    (state) => state.auth
  );
  const [isReadable, setIsReadable] = useState(false);
  const [recaptcha, setRecaptcha] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isFirstCreateAppointment, setIsFirstCreateAppointment] =
    useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const isDesktop = useRWD();
  const dispatch = useDispatch();

  const showDoctorInfo = async (id) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
    const doctor = await getDoctorById(id);
    const weekDay = ["日", "一", "二", "三", "四", "五", "六"];
    const organizedSchedules = doctor.schedules.map((s) => {
      const formattedDate =
        dayjs(s.date).format("M/D") +
        "（" +
        weekDay[dayjs(s.date).day()] +
        "）";
      const formattedSlot = s.scheduleSlot.includes("Morning")
        ? "上午診"
        : "下午診";
      return { ...s, date: formattedDate, scheduleSlot: formattedSlot };
    });
    const organizedDoctor = { ...doctor, schedules: organizedSchedules };
    setSelectedDoctor(organizedDoctor);
    setIsModalLoading(false);
  };

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
      render: (_, record) => (
        <Button onClick={() => showDoctorInfo(record.doctorId)}>
          快速掛號
        </Button>
      ),
    },
  ];

  const tableData = appointments.map((item) => ({
    key: item.appointmentId,
    appointmentId: item.appointmentId,
    doctorScheduleId: item.doctorScheduleId,
    doctorId: item.doctorId,
    date: item.date,
    scheduleSlot: item.scheduleSlot,
    specialty: item.doctorSpecialty,
    doctorName: item.doctorName,
    consultationNumber: item.consultationNumber,
    status: item.status === "CANCELED" ? "已取消" : "已掛號",
  }));

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

          setAppointments(organizedAppointments);

          setIsLoading(false);
          setIsPageLoading(false);
        }
        //持有帳號的使用者必須登入才能查看掛號
        if (patientAppointments.data.message?.includes("登入")) {
          setIsLoading(false);
          setIsPageLoading(false);
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
        return "success";
      } catch (error) {
        console.error(error);
      }
    },
    [navigate]
  );

  //查詢表單送出
  const handleFinish = async (values) => {
    if (recaptcha === "") {
      return setRecaptchaError("請驗證reCaptcha");
    }

    const requestData = {
      idNumber: values.idNumber,
      birthDate: new Date(
        Date.UTC(values.year, values.month - 1, values.day)
      ).toISOString(),
      recaptchaResponse: recaptcha,
    };
    const result = await getAppointmentsDataAsync(requestData);
    //未註冊使用者查詢成功
    if (result === "success") {
      setIsReadable(true);
      //未登入使用者狀態儲存，用以比對使用者再次輸入的掛號資料是否一致
      dispatch(
        setTempUserData({
          idNumber: values.idNumber,
          birthDate: new Date(
            Date.UTC(values.year, values.month - 1, values.day)
          ).toISOString(),
        })
      );
      setRecaptcha("");
    }
  };

  const handlerecaptchaChange = (value) => {
    setRecaptcha(value);
    setRecaptchaError("");
  };

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

  return (
    <>
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
            <h1 className="text-2xl mb-6">歷史掛號查詢</h1>
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
        <SelectedModal
          selectedDoctor={selectedDoctor}
          isModalOpen={isModalOpen}
          setSelectedDoctor={setSelectedDoctor}
          setIsSubmitLoading={setIsSubmitLoading}
          isFirstCreateAppointment={isFirstCreateAppointment}
          isModalLoading={isModalLoading}
          isSubmitLoading={isSubmitLoading}
          setIsFirstCreateAppointment={setIsFirstCreateAppointment}
          setIsModalOpen={setIsModalOpen}
        />
      </Content>
    </>
  );
};

export default AppointmentHistoryPage;
