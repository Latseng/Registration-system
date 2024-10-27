import { Layout, Form, Input, Button, Modal, List, message,} from "antd";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import { useState, useEffect } from "react";
import {
  getAppointments,
  cancelAppointment,
  createAppointment,
  deleteAppointment,
} from "../api/appointments";
import { FaRegUser } from "react-icons/fa";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import {useSelector} from 'react-redux'
import { useDispatch } from "react-redux";
import {resetNewAppointment} from "../store/appointmentSlice"
import { GrStatusGood } from "react-icons/gr";


const { Content } = Layout;

const items = [
  {
    key: "1",
    label: "快速掛號",
  },
  {
    key: "2",
    label: "掛號查詢",
  },
  {
    key: "3",
    label: "看診紀錄",
  },
  {
    key: "4",
    label: "醫師專長查詢",
  },
];

const QueryPage = () => {
  const navigate = useNavigate();
  const isDesktop = useRWD();
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const [appointments, setAppointments] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState({cancelModal: false, againModal: false})
  const [requestData, setRequestData] = useState({})
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false)
  const newAppointment = useSelector(
    (state) => state.appointment.newAppointment
  );

const getAppointmentsDataAsync = async (data) => {
  try {
    const patientAppointments = await getAppointments(data);
    if (
      patientAppointments.data.message ===
      "No appointments found for this patient."
    ) {
      setIsLoading(false);
      messageApi.open({
        type: "warning",
        content: "查無掛號紀錄",
      });
      return;
    }

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
    setIsVerified(true);
    setIsLoading(false)
    setIsPageLoading(false)
  } catch (error) {
    console.error(error);
  }
};
 
useEffect(() => {
    if(newAppointment) {
      setIsVerified(true);
      setIsPageLoading(true)
      getAppointmentsDataAsync(newAppointment.requestData);
      setIsAppointmentSuccess(true)
    }
    return () => {
      dispatch(resetNewAppointment());
    };
  }, []);


  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickLogo = () => {
    navigate("/*");
  };
  const handleClickPage = (e) => {
    switch (e.key) {
      case "1":
        navigate("/departments");
        break;
      case "2":
        navigate("/query");
        break;
      case "3":
        navigate("/records");
        break;
      case "4":
        navigate("/doctors");
        break;
      default:
        break;
    }
  };

const handleFinish = (values) => {
  setIsLoading(true)
  const birthDate = new Date(
    Date.UTC(values.year, values.month - 1, values.day)
  ).toISOString();
   const requestData = {
    idNumber: values.idNumber,
    birthDate: birthDate, 
    recaptchaResponse: "test_recaptcha", 
  }
getAppointmentsDataAsync(requestData);
}


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
    if(!isValid) {
    return Promise.reject(new Error("身分證字號格式錯誤"));
    }
    })
  }

  const handleClick = async (id, act) => {
    if(act === "delete") {
      await deleteAppointment(id);
      const newAppointments = appointments.filter((a) => a.appointmentId !== id);
      setAppointments(newAppointments)
      return
    }
    
    if(act === "cancel") {
      setConfirmModal({...confirmModal, cancelModal: true}) 
      return
    }
    setConfirmModal({ ...confirmModal, againModal: true });
  }

  const handleAppointment = async (value, data) => {
    if (value === "cancel") {
      setConfirmModal({
        ...confirmModal,
        cancelModal: false,
      });
      setIsAppointmentSuccess(false);
      setIsLoading(true)
    await cancelAppointment(data.appointmentId)
    setAppointments(appointments.map((a) => {
      a.appointmentId === data.appointmentId
    return { ...a, status: "CANCELED" };
    }));
    setIsLoading(false)
    messageApi.open({
      type: "warning",
      content: "掛號已取消",
    });
    
    return
  }
  setConfirmModal({
    ...confirmModal,
    againModal: false,
  });
  setIsPageLoading(true)
  await createAppointment({
    ...requestData,
    doctorScheduleId: data.doctorScheduleId,
  });
  await getAppointmentsDataAsync(requestData)
  messageApi.open({
    type: "success",
    content: "掛號成功",
  });
  }

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Sidebar
        items={items}
        onClickPage={handleClickPage}
        onClickLogo={handleClickLogo}
      />

      {isDesktop && (
        <button className="absolute right-8 top-4" onClick={handleClickLogin}>
          登入
        </button>
      )}
      <Content className="bg-gray-100 p-4">
        {isVerified ? (
          isPageLoading ? (
            <List loading={isPageLoading}></List>
          ) : appointments ? (
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
                    <p>{a.date + a.scheduleSlot}</p>
                    <p>{a.doctorSpecialty}</p>
                    <p>醫師：{a.doctorName}</p>
                    <p>看診號碼：{a.consultationNumber}</p>

                    {a.status === "CONFIRMED" ? (
                      <>
                        <Button
                          loading={isLoading}
                          onClick={() => handleClick(a.appointmentId, "cancel")}
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
                          <p>您確定要取消掛號？若取消，再次看診需要重新掛號</p>
                        </Modal>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleClick(a.appointmentId, "again")}
                        >
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
                    <Button
                      onClick={() => handleClick(a.appointmentId, "delete")}
                    >
                      刪除掛號
                    </Button>
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
                type="primary"
                htmlType="submit"
              >
                查詢
              </Button>
              或
              <Button size="large" type="link">
                註冊
              </Button>
              以方便您利用本系統
            </Form.Item>
          </Form>
        )}
      </Content>
    </Layout>
  );
};

export default QueryPage;
