import { Layout, Form, Input, Button, Modal, List, message } from "antd";
import { useState, useEffect, useCallback } from "react";
import {
  getAppointmentsBypatient,
  cancelAppointment,
  createAppointment,
} from "../api/appointments";
import { FaRegUser } from "react-icons/fa";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { resetNewAppointment } from "../store/appointmentSlice";
import { GrStatusGood } from "react-icons/gr";
import LoginButton from "../components/LoginButton";
import { useNavigate, Link } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useRWD from "../hooks/useRWD";
import { setLogin } from "../store/authSlice";

const { Content } = Layout;
const { confirm } = Modal;
const queryString = window.location.search; //第三方登入狀態判斷

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
  const newAppointment = useSelector(
    (state) => state.appointment.newAppointment
  );

  const { isAuthenticated, role } = useSelector((state) => state.auth);

  const isDesktop = useRWD();

  const getAppointmentsDataAsync = useCallback(
    async (data) => {
    try {
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

      if (
        patientAppointments.data.message ===
        "No appointments found for this patient."
      ) {
        setIsLoading(false);
        setAppointments([]);
        setIsPageLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  },
  [navigate]
  )

  useEffect(() => {
    //如果第三方登入驗證成功的話，存入登入狀態資料
    if (queryString.includes("true")) {
      dispatch(
        setLogin({ user: { account: "google account" }, role: "patient" })
      );
    }

    //檢查使用者是否為登入狀態
    if (isAuthenticated && role === "patient") {
      setIsPageLoading(true);
      const queryPayload = {
        recaptchaResponse: "test_recaptcha",
        isLogin: true,
      };
      getAppointmentsDataAsync(queryPayload);
    }
    //如果是初診狀態，則做初診病患資料的相關處理
    if (newAppointment) {
      setIsPageLoading(true);
      getAppointmentsDataAsync(newAppointment.requestData);
      setIsAppointmentSuccess(true);
    }

    return () => {
      dispatch(resetNewAppointment());
    };
  }, [dispatch, getAppointmentsDataAsync, isAuthenticated, newAppointment, role]);

  const handleFinish = async (values) => {
    setIsLoading(true);
    const birthDate = new Date(
      Date.UTC(values.year, values.month - 1, values.day)
    ).toISOString();
    const requestData = {
      idNumber: values.idNumber,
      birthDate: birthDate,
      recaptchaResponse: "test_recaptcha",
    };
    getAppointmentsDataAsync(requestData);
  };

  const idNumberValidation = async (_, value) => {
    function validateIdNumber(idNumber) {
      const regex = /^[A-Z][12]\d{8}$/;

      if (!regex.test(idNumber)) {
        return false;
      }

      const letterMapping = {
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
        G: 16,
        H: 17,
        I: 34,
        J: 18,
        K: 19,
        L: 20,
        M: 21,
        N: 22,
        O: 35,
        P: 23,
        Q: 24,
        R: 25,
        S: 26,
        T: 27,
        U: 28,
        V: 29,
        W: 32,
        X: 30,
        Y: 31,
        Z: 33,
      };

      const firstLetterValue = letterMapping[idNumber[0]];

      const n1 = Math.floor(firstLetterValue / 10);

      const n2 = firstLetterValue % 10;

      const n3 = parseInt(idNumber[1]);

      const n4 = parseInt(idNumber[2]);

      const n5 = parseInt(idNumber[3]);

      const n6 = parseInt(idNumber[4]);

      const n7 = parseInt(idNumber[5]);

      const n8 = parseInt(idNumber[6]);

      const n9 = parseInt(idNumber[7]);

      const n10 = parseInt(idNumber[8]);

      const n11 = parseInt(idNumber[9]);

      const total =
        n1 * 1 +
        n2 * 9 +
        n3 * 8 +
        n4 * 7 +
        n5 * 6 +
        n6 * 5 +
        n7 * 4 +
        n8 * 3 +
        n9 * 2 +
        n10 * 1 +
        n11 * 1;

      return total % 10 === 0;
    }
    const isValid = validateIdNumber(value);
    return Promise.resolve().then(() => {
      if (!isValid) {
        return Promise.reject(new Error("身分證字號格式錯誤"));
      }
    });
  };

  const handleClick = async (act) => {
    if (act === "cancel") {
      // 取消掛號確認
      setConfirmModal({ ...confirmModal, cancelModal: true });
      return;
    }
    // 重新掛號確認
    setConfirmModal({ ...confirmModal, againModal: true });
  };

  const handleAppointment = async (value, data) => {
    if (value === "cancel") {
      setConfirmModal({
        ...confirmModal,
        cancelModal: false,
      });
      setIsAppointmentSuccess(false);
      setIsLoading(true);
      await cancelAppointment(data.appointmentId);
      setAppointments(
        appointments.map((a) => {
          a.appointmentId === data.appointmentId;
          return { ...a, status: "CANCELED" };
        })
      );
      setIsLoading(false);
      messageApi.open({
        type: "warning",
        content: "掛號已取消",
      });

      return;
    }
    setConfirmModal({
      ...confirmModal,
      againModal: false,
    });
    setIsPageLoading(true);
    await createAppointment({
      ...requestData,
      doctorScheduleId: data.doctorScheduleId,
    });
    await getAppointmentsDataAsync(requestData);
    messageApi.open({
      type: "success",
      content: "掛號成功",
    });
  };

  return (
    <>
      {contextHolder}
      {isDesktop && <LoginButton />}
      <Content className="bg-gray-100 p-4">
        {isPageLoading ? (
          <List loading={isPageLoading}></List>
        ) : isAuthenticated ? (
          appointments ? (
            <>
              <h1 className="text-2xl mb-6">您的看診時段</h1>
              <List bordered className="bg-white px-8 py-4">
                {isAppointmentSuccess && (
                  <div className="flex items-center justify-center text-lg">
                    <GrStatusGood className="text-green-500" />
                    <span>掛號成功</span>
                  </div>
                )}
                {appointments.length === 0 && (
                  <List.Item>沒有掛號紀錄</List.Item>
                )}
                {appointments.map((a) => (
                  <List.Item key={a.appointmentId}>
                    <div className="w-full flex flex-wrap justify-between items-center">
                      <p className="m-4">{a.date + a.scheduleSlot}</p>
                      <p className="m-4">{a.doctorSpecialty}</p>
                      <p className="m-4">醫師：{a.doctorName}</p>
                      <p className="m-4">看診號碼：{a.consultationNumber}</p>
                      {a.status === "CONFIRMED" ? (
                        <>
                          <Button
                            loading={isLoading}
                            onClick={() => handleClick("cancel")}
                          >
                            {isLoading ? "" : "取消掛號"}
                          </Button>
                          <Modal
                            title="取消掛號確認"
                            open={confirmModal.cancelModal}
                            onOk={() => handleAppointment("cancel", a)}
                            onCancel={() =>
                              setConfirmModal({
                                ...confirmModal,
                                cancelModal: false,
                              })
                            }
                          >
                            <p>
                              您確定要取消掛號？若取消，再次看診需要重新掛號
                            </p>
                          </Modal>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => handleClick("again")}>
                            重新掛號
                          </Button>
                          <Modal
                            title="重新掛號確認"
                            open={confirmModal.againModal}
                            onOk={() => handleAppointment("again", a)}
                            onCancel={() =>
                              setConfirmModal({
                                ...confirmModal,
                                againModal: false,
                              })
                            }
                          >
                            <p>將重新為您掛號同一診次</p>
                            <p>{a.date + a.scheduleSlot}</p>
                            <p>{a.doctorSpecialty}</p>
                            <p>醫師：{a.doctorName}</p>
                          </Modal>
                        </>
                      )}
                    </div>
                  </List.Item>
                ))}
              </List>
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

export default QueryPage;
