import { Layout, Form, Input, Button, Modal, List, Table, message } from "antd";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAppointmentsBypatient,
  cancelAppointment,
  createAppointment,
} from "../api/appointments";
import { FaRegUser } from "react-icons/fa";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { resetNewAppointment } from "../store/appointmentSlice";
import { GrStatusGood } from "react-icons/gr";
import LoginButton from "../components/LoginButton";
import { useNavigate, Link } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useRWD from "../hooks/useRWD";
import { setLogin } from "../store/authSlice";
import { CSRF_request } from "../api/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { idNumberValidation } from "../helper/idNumber";

const { Content } = Layout;
const { confirm } = Modal;
dayjs.extend(customParseFormat);

const QueryPage = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    cancelModal: false,
    againModal: false,
  });
  const [requestData, setRequestData] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
  const { isNewDataCreated, newAppointment } = useSelector(
    (state) => state.appointment
  );
  const { isAuthenticated, role, CSRF_token } = useSelector(
    (state) => state.auth
  );
  const [selectedAppointment, setSelectedAppointment] = useState({});
  const [isReadable, setIsReadable] = useState(false);
  const [recaptcha, setRecaptcha] = useState("");

  //使用者未登入，操作用到的暫存身份資料
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [recaptchaError, setRecaptchaError] = useState("");
  const [formDataError, setFormDataError] = useState("");

  const isDesktop = useRWD();

  const isCallGoogle = useRef(false);

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
      title: "候診號碼",
      key: "consultationNumber",
      dataIndex: "consultationNumber",
    },
    {
      title: "掛號狀態",
      key: "status",
      dataIndex: "status",
    },
    {
      render: (_, record) =>
        record.status === "已掛號" ? (
          <Button danger onClick={() => handleClick("cancel", record)}>
            取消掛號
          </Button>
        ) : (
          <Button onClick={() => handleClick("again", record)}>重新掛號</Button>
        ),
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
    .sort((a, b) => {
      // 1. 根據狀態排序
      if (a.status === "已掛號" && b.status !== "已掛號") {
        return -1; // a 排在前
      }
      if (a.status !== "已掛號" && b.status === "已掛號") {
        return 1; // b 排在前
      }

      // 2. 狀態相同，根據日期排序
      const dateA = new Date(dayjs(a.date, "M/D").toDate());
      const dateB = new Date(dayjs(b.date, "M/D").toDate());

      if (a.status === "已掛號") {
        // 候診中：日期越近越前
        return dateA - dateB;
      } else {
        // 非候診中：日期越晚越前
        return dateB - dateA;
      }
    });

  const getAppointmentsDataAsync = useCallback(
    async (data) => {
      try {
        setIsPageLoading(true);
        const patientAppointments = await getAppointmentsBypatient(data);
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

  const getCSRF_tokenAsync = useCallback(async () => {
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
  }, [dispatch]);

  useEffect(() => {
    //如果第三方登入驗證成功的話，存入登入狀態資料
    const queryString = window.location.search; //第三方登入狀態判斷
    if (queryString.includes("true") && !isCallGoogle.value) {
      getCSRF_tokenAsync();
    }

    //檢查使用者是否為登入狀態
    if (isAuthenticated && role === "patient") {
      setIsPageLoading(true);
      const queryPayload = {
        isAuthenticated,
        CSRF_token,
      };
      getAppointmentsDataAsync(queryPayload);
      setIsReadable(true);
    }

    //新掛號建立後，病患可立即查看
    if (isNewDataCreated) {
      setIsPageLoading(true);
      getAppointmentsDataAsync(newAppointment.requestData);
      setIsAppointmentSuccess(true);
      setIsReadable(true);
    }
    return () => {
      dispatch(resetNewAppointment());
    };
  }, [
    dispatch,
    getAppointmentsDataAsync,
    isAuthenticated,
    newAppointment,
    role,
    CSRF_token,
    isNewDataCreated,
    getCSRF_tokenAsync,
  ]);

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

  // const idNumberValidation = async (_, value) => {
  //   function validateIdNumber(idNumber) {
  //     const regex = /^[A-Z][12]\d{8}$/;

  //     if (!regex.test(idNumber)) {
  //       return false;
  //     }

  //     const letterMapping = {
  //       A: 10,
  //       B: 11,
  //       C: 12,
  //       D: 13,
  //       E: 14,
  //       F: 15,
  //       G: 16,
  //       H: 17,
  //       I: 34,
  //       J: 18,
  //       K: 19,
  //       L: 20,
  //       M: 21,
  //       N: 22,
  //       O: 35,
  //       P: 23,
  //       Q: 24,
  //       R: 25,
  //       S: 26,
  //       T: 27,
  //       U: 28,
  //       V: 29,
  //       W: 32,
  //       X: 30,
  //       Y: 31,
  //       Z: 33,
  //     };

  //     const firstLetterValue = letterMapping[idNumber[0]];

  //     const n1 = Math.floor(firstLetterValue / 10);

  //     const n2 = firstLetterValue % 10;

  //     const n3 = parseInt(idNumber[1]);

  //     const n4 = parseInt(idNumber[2]);

  //     const n5 = parseInt(idNumber[3]);

  //     const n6 = parseInt(idNumber[4]);

  //     const n7 = parseInt(idNumber[5]);

  //     const n8 = parseInt(idNumber[6]);

  //     const n9 = parseInt(idNumber[7]);

  //     const n10 = parseInt(idNumber[8]);

  //     const n11 = parseInt(idNumber[9]);

  //     const total =
  //       n1 * 1 +
  //       n2 * 9 +
  //       n3 * 8 +
  //       n4 * 7 +
  //       n5 * 6 +
  //       n6 * 5 +
  //       n7 * 4 +
  //       n8 * 3 +
  //       n9 * 2 +
  //       n10 * 1 +
  //       n11 * 1;

  //     return total % 10 === 0;
  //   }
  //   const isValid = validateIdNumber(value);
  //   return Promise.resolve().then(() => {
  //     if (!isValid) {
  //       return Promise.reject(new Error("身分證字號格式錯誤"));
  //     }
  //   });
  // };

  const handleClick = async (act, appointment) => {
    setSelectedAppointment(appointment);
    if (act === "cancel") {
      // 取消掛號確認
      setConfirmModal({ ...confirmModal, cancelModal: true });
      return;
    }
    // 重新掛號確認
    setConfirmModal({ ...confirmModal, againModal: true });
  };

  //使用者已登入
  const handleAppointment = async (value) => {
    //取消掛號
    if (value === "cancel") {
      setConfirmModal({
        ...confirmModal,
        cancelModal: false,
      });
      setSelectedAppointment({});
      setIsAppointmentSuccess(false);
      setIsPageLoading(true);
      await cancelAppointment(
        selectedAppointment.appointmentId,
        null,
        null,
        isAuthenticated,
        CSRF_token,
        null
      );
      setAppointments(
        appointments.map((a) => {
          if (a.appointmentId === selectedAppointment.appointmentId) {
            return { ...a, status: "CANCELED" };
          }
          return a;
        })
      );
      setIsPageLoading(false);
      messageApi.open({
        type: "warning",
        content: "掛號已取消",
      });
      return;
    }
    //使用者登入狀態重新掛號
    setConfirmModal({
      ...confirmModal,
      againModal: false,
    });
    setSelectedAppointment({});
    setIsPageLoading(true);
    const result = await createAppointment({
      ...requestData,
      doctorScheduleId: selectedAppointment.doctorScheduleId,
      CSRF_token,
    });
    //重複掛號
    if (result === "You have already booked this time slot.") {
      setIsPageLoading(false);
      messageApi.open({
        type: "warning",
        content: "重複掛號",
      });
      return;
    }

    await getAppointmentsDataAsync(requestData);
    messageApi.open({
      type: "success",
      content: "掛號成功",
    });
  };

  const handleCloseConfirmModal = (act) => {
    form.resetFields();
    if (act === "cancel") {
      setConfirmModal({
        ...confirmModal,
        cancelModal: false,
      });
      setSelectedAppointment({});
    } else {
      setConfirmModal({
        ...confirmModal,
        againModal: false,
      });
      setSelectedAppointment({});
    }
  };

  const handlerecaptchaChange = (value) => {
    setRecaptcha(value);
    setRecaptchaError("");
  };

  //使用者未登入重新掛號
  const handleReCreateAppointment = async (values) => {
    //確保recaptcha通過驗證
    if (recaptcha === "") {
      return setRecaptchaError("請驗證reCaptcha");
    }
    // 檢查重新掛號的資料是否正確
    if (
      values.idNumber !== idNumber ||
      new Date(
        Date.UTC(values.year, values.month - 1, values.day)
      ).toISOString() !== birthDate
    ) {
      setFormDataError("身份資料輸入錯誤，請檢查身份證字號或生日是否正確");
      return;
    }
    setConfirmModal({
      ...confirmModal,
      againModal: false,
    });
    setIsPageLoading(true);
    const requestData = {
      idNumber: values.idNumber,
      birthDate: new Date(
        Date.UTC(values.year, values.month - 1, values.day)
      ).toISOString(),
      recaptchaResponse: recaptcha,
    };
    const result = await createAppointment({
      ...requestData,
      doctorScheduleId: selectedAppointment.doctorScheduleId,
    });
    //重複掛號
    if (result === "You have already booked this time slot.") {
      setIsPageLoading(false);
      messageApi.open({
        type: "warning",
        content: "重複掛號",
      });
      return;
    }
    await getAppointmentsDataAsync(requestData);
    messageApi.open({
      type: "success",
      content: "掛號成功",
    });
    setConfirmModal({
      ...confirmModal,
      againModal: false,
    });
    setSelectedAppointment({});
    form.resetFields();
  };
  //使用者未登入取消掛號
  const handleCancelAppointment = async () => {
    setConfirmModal({
      ...confirmModal,
      cancelModal: false,
    });
    setSelectedAppointment({});
    setIsAppointmentSuccess(false);
    setIsPageLoading(true);

    await cancelAppointment(
      selectedAppointment.appointmentId,
      idNumber,
      birthDate,
      isAuthenticated,
      CSRF_token,
      recaptcha
    );
    setAppointments(
      appointments.map((a) => {
        if (a.appointmentId === selectedAppointment.appointmentId) {
          return { ...a, status: "CANCELED" };
        }
        return a;
      })
    );
    setIsPageLoading(false);
    messageApi.open({
      type: "warning",
      content: "掛號已取消",
    });
    form.resetFields();
  };

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
              <h1 className="text-2xl mb-6">您的掛號紀錄</h1>
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
            <h1 className="text-2xl mb-6">您目前沒有看診掛號</h1>
          )
        ) : (
          <Form
            name="login"
            className="mx-auto mt-8 text-center rounded-2xl md:w-1/2 bg-white p-4"
            initialValues={{
              remember: true,
            }}
            onFinish={handleFinish}
          >
            <h1 className="text-2xl mb-6">掛號資訊查詢</h1>
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
        {isAuthenticated ? (
          <Modal
            title="取消掛號確認"
            open={confirmModal.cancelModal}
            onOk={() => handleAppointment("cancel")}
            onCancel={() => handleCloseConfirmModal("cancel")}
          >
            <div className="ml-8 mt-4">
              <p>您確定要取消掛號？</p>
              <p>
                {selectedAppointment.date + selectedAppointment.scheduleSlot}
              </p>
              <p>{selectedAppointment.doctorSpecialty}</p>
              <p>醫師：{selectedAppointment.doctorName}</p>
              <p>若取消，再次看診須重新掛號</p>
            </div>
          </Modal>
        ) : (
          <Modal
            title="取消掛號確認"
            open={confirmModal.cancelModal}
            onOk={handleCancelAppointment}
            onCancel={() => handleCloseConfirmModal("cancel")}
          >
            <div className="ml-8 mt-4">
              <p>您確定要取消掛號？</p>
              <p>
                {selectedAppointment.date + selectedAppointment.scheduleSlot}
              </p>
              <p>{selectedAppointment.doctorSpecialty}</p>
              <p>醫師：{selectedAppointment.doctorName}</p>
              <p>若取消，再次看診須重新掛號</p>
            </div>
          </Modal>
        )}
        {isAuthenticated ? (
          <Modal
            title="重新掛號確認"
            open={confirmModal.againModal}
            onOk={() => handleAppointment("again")}
            onCancel={() => handleCloseConfirmModal("again")}
          >
            <div className="md:mx-10 mt-4">
              <p>將重新為您掛號同一診次</p>
              <p>
                {selectedAppointment.date + selectedAppointment.scheduleSlot}
              </p>
              <p>{selectedAppointment.doctorSpecialty}</p>
              <p>醫師：{selectedAppointment.doctorName}</p>
            </div>
          </Modal>
        ) : (
          <Modal
            title="重新掛號確認"
            open={confirmModal.againModal}
            onCancel={() => handleCloseConfirmModal("again")}
            footer={null}
          >
            <div className="md:mx-10 mt-4">
              <p>將重新為您掛號同一診次</p>
              <p>
                {selectedAppointment.date + selectedAppointment.scheduleSlot}
              </p>
              <p>{selectedAppointment.doctorSpecialty}</p>
              <p>醫師：{selectedAppointment.doctorName}</p>
              {!isAuthenticated && (
                <Form
                  name="create-appointment"
                  className="mx-auto my-4 text-center rounded-2xl  bg-white"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={handleReCreateAppointment}
                >
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
                  {/* 輸入資料錯誤 */}
                  {formDataError !== "" && (
                    <span className="text-red-500">{formDataError}</span>
                  )}
                  <ReCAPTCHA
                    className="my-4"
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handlerecaptchaChange}
                  />
                  {/* recaptcaha 錯誤 */}
                  {recaptchaError !== "" && (
                    <span className="text-red-500">{recaptchaError}</span>
                  )}
                  <Form.Item>
                    <div className="my-4 flex gap-4">
                      <Button
                        onClick={() => handleCloseConfirmModal("again")}
                        block
                      >
                        取消
                      </Button>
                      <Button
                        block
                        loading={isLoading}
                        type="primary"
                        htmlType="submit"
                      >
                        確認
                      </Button>
                    </div>
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
            </div>
          </Modal>
        )}
      </Content>
    </>
  );
};

export default QueryPage;
