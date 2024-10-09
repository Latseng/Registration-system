import { Layout, Form, Card, Input, Flex, Checkbox, Button, Modal, List, message,} from "antd";
import Sidebar from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import { useState, useEffect } from "react";
import { getAppointments } from "../api/appointments";
import { FaRegUser } from "react-icons/fa";
import DatePicker from "../components/DatePicker";
import { patchAppointment } from "../api/schedules";

const { Content } = Layout;



const QueryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useRWD();
  const [form] = Form.useForm();
  
  const [appointments, setAppointments] = useState([])
  const [appointmentState, setAppointmentState] = useState(location.state || "");
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false)
  
  const handleshowModal = () => {
    setIsModalOpen(true);
  };


  const handleModalCancel = () => {
    setIsModalOpen(false);
  };


  // useEffect(() => {
  //   const getAppointmentData = async () => {
  //     try {
  //      const response = await getAppointments();
  //      console.log(response.data)
  //      setAppointments(response.data)
       
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   getAppointmentData()
  //   if(appointmentState === 'success') {
  //     messageApi.open({
  //       type: "success",
  //       content: "掛號成功",
  //     });
  //     setAppointmentState("")
  //   }
  // }, []);


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
  const birthDate = new Date(
    values.year,
    values.month - 1,
    values.day
  ).toISOString();
  const requestData = {
    idNumber: values.idNumber,
    birthDate: birthDate, 
    recaptchaResponse: "test_recaptcha", 
  };
  const getAppointmentsDataAsync = async () => {
    try {
      const patientAppointments = getAppointments(requestData)
      console.log(patientAppointments);
      
    } catch(error) {
      console.error(error);
    }
    
}
getAppointmentsDataAsync();
}

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />

      {isDesktop && (
        <button className="absolute right-8 top-4" onClick={handleClickLogin}>
          登入
        </button>
      )}
      <Content className="bg-gray-100 p-6">
        {isVerified ? (
          appointments ? (
            <>
              <h1 className="text-2xl mb-6">您的看診時段</h1>
              <List bordered className="bg-white px-8 py-4">
                {appointments.map((a) => (
                  <List.Item key={a.id}>
                    <p>姓名：{a.patientId}</p>
                    <p>醫師：{a.doctorScheduleId}</p>
                    <p>預約號碼：{a.consultationNumber}</p>
                    <Button>
                      {a.status === "CONFIRMED" ? "取消掛號" : "重新掛號"}
                    </Button>
                  </List.Item>
                ))}
                {/* <Card
                title="目前看診進度"
                bordered={false}
                style={{ width: 300 }}
              >
                <p>門診尚未開始</p>
              </Card>
              <Button className="mt-6" onClick={handleshowModal}>
                取消掛號
              </Button>
              <Modal
                title="您確定要取消掛號？"
                open={isModalOpen}
                onCancel={handleModalCancel}
                footer={null}
              >
                <p className="my-6">
                  若取消掛號，再次看診必須重新掛號、重新候診。
                </p>
                <Button
                  className="w-full"
                  // onClick={() => handleDelete(appointment.id)}
                  danger
                >
                  確定取消
                </Button>
              </Modal> */}
              </List>
            </>
          ) : (
            <h1 className="text-2xl mb-6">您目前沒有看診掛號</h1>
          )
        ) : (
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            style={{
              maxWidth: 360,
            }}
            onFinish={handleFinish}
          >
            <h1 className="text-2xl mb-6">查詢您的掛號資訊</h1>
            <Form.Item
              label="身份證字號"
              name="idNumber"
              rules={[
                {
                  required: true,
                  message: "請輸入身份證字號",
                },
                {
                  pattern: /^[A-Z][0-9]{9}$/,
                  message: "身份證字號格式錯誤，請輸入正確的身份證字號",
                },
              ]}
            >
              <Input prefix={<FaRegUser />} placeholder="身份證字號" />
            </Form.Item>
            <Form.Item label="生日">
              <DatePicker form={form}></DatePicker>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
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
