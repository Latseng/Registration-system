import { Layout,  Card, Button,Modal, message,} from "antd";
import Sidebar from "../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import { useState, useEffect } from "react";
import { getAppointment, deleteAppointment } from "../api/appointment";

const { Content } = Layout;


const QueryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useRWD();
  
  const [appointment, setAppointment] = useState(null)
  const [appointmentState, setAppointmentState] = useState(location.state || "");
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleshowModal = () => {
    setIsModalOpen(true);
  };


  const handleModalCancel = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const getAppointmentData = async () => {
      try {
       const response = await getAppointment();
       setAppointment(response[0])
       
      } catch (error) {
        console.error(error);
      }
    }
    getAppointmentData()
    if(appointmentState === 'success') {
      messageApi.open({
        type: "success",
        content: "掛號成功",
      });
      setAppointmentState("")
    }
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

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id)
      setAppointment(null)
      setIsModalOpen(false);
      messageApi.open({
        type: "warning",
        content: "掛號已取消",
      });

    } catch(error) {
      console.error(error);
    }
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
        {appointment ? (
          <>
            <h1 className="text-2xl mb-6">您的看診時段</h1>
            <div className="bg-white px-8 py-4">
              <h3>日期：{appointment.date}</h3>
              <h3>時段：{appointment.time}</h3>
              <h3>看診醫師：{appointment.doctor}</h3>
              <Card
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
                  onClick={() => handleDelete(appointment.id)}
                  danger
                >
                  確定取消
                </Button>
              </Modal>
            </div>
          </>
        ) : (
          <h1 className="text-2xl mb-6">您目前沒有看診掛號</h1>
        )}
      </Content>
    </Layout>
  );
};

export default QueryPage;
