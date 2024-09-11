import useRWD from "../hooks/useRWD";
import { useState } from "react";
import Logo from "../components/Logo";
import {
  Layout,
  Menu,
  Button,
  Table,
  Divider,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Breadcrumb,
  ConfigProvider,
} from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";


const { Sider, Header, Content } = Layout;
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
];

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = dayjs().add(i, "day");
    const formattedDate = `${date.format("M/D")}（${"日一二三四五六".charAt(
      date.day()
    )}）`;
    
    dates.push(formattedDate);
  }
  return dates;
};


const doctors = [
  "陳OO 醫師",
  "王OO 醫師",
  "張OO 醫師",
  "李OO 醫師",
  "林OO 醫師",
  "趙OO 醫師",
  "周OO 醫師",
];

const generateRandomDoctorSlots = () => {
  const doctorSlots = [];
  const numDoctors = Math.floor(Math.random() * 3) + 1; // 隨機1到3位醫師
  
  for (let i = 0; i < numDoctors; i++) {
    const randomDoctor =
      doctors[Math.floor(Math.random() * doctors.length)];
    const numOfPatients = Math.floor(Math.random() * 21); // 隨機掛號人數
    const isFull = numOfPatients >= 20; // 超過20人不可點擊
    doctorSlots.push({
      doctor: randomDoctor,
      numOfPatients,
      isFull,
    });
  }
  return doctorSlots;
};


const ClinicSchedulePage = () => {
  const navigate = useNavigate();
  const isDesktop = useRWD();
  const dates = generateDates()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();

  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickLogo = () => {
    navigate("/*");
  };

  

  const handleAppointment = (appointment) => {
   setSelectedAppointment(appointment);
    
    setIsModalOpen(true);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values: ", values);
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "時間",
      dataIndex: "time",
      key: "time",
      fixed: "left",
    },
    ...dates.map((date, index) => ({
      title: date,
      dataIndex: `date${index}`,
      key: `date${index}`,
      render: (_, record) => {
        
        const doctorSlot = record[`date${index}`];
        
          return doctorSlot.map(({ doctor, numOfPatients, isFull }, idx) => (
            <Button onClick={() => handleAppointment({date: date, doctor: doctor, time: record.time})} key={idx} type="link" disabled={isFull}>
              {doctor} <br /> {isFull ? "額滿" : `掛號人數: ${numOfPatients}`}
            </Button>
          ));
       
      },
    })),
  ];

  const dataSource = [
    {
      key: "morning",
      time: "上午診",
      ...dates.reduce((acc, _, index) => {
        acc[`date${index}`] = generateRandomDoctorSlots(); // 填入隨機醫師資料
        return acc;
      }, {}),
    },
    {
      key: "afternoon",
      time: "下午診",
      ...dates.reduce((acc, _, index) => {
        acc[`date${index}`] = generateRandomDoctorSlots(); // 填入隨機醫師資料
        return acc;
      }, {}),
    },
    {
      key: "evening",
      time: "夜診",
      ...dates.reduce((acc, _, index) => {
        acc[`date${index}`] = generateRandomDoctorSlots(); // 填入隨機醫師資料
        return acc;
      }, {}),
    },
  ];

  return (
    <Layout className="min-h-screen">
      {isDesktop ? (
        <Sider
          width={200}
          style={{ backgroundColor: "rgb(37 99 235)" }}
          className="px-6 flex flex-col items-center py-6"
        >
          <button
            onClick={() => navigate("/*")}
            className="mx-auto flex items-center text-white text-3xl"
          >
            <FaSuitcaseMedical className="mr-2" />
            <h1>MA</h1>
          </button>
          <Divider className="bg-white w-full" />
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemColor: "white",
                  itemSelectedColor: "rgb(59 130 246)",
                },
              },
            }}
          >
            <Menu
              mode="vertical"
              defaultSelectedKeys={["1"]}
              className="bg-blue-600 px-6"
              items={items}
            />
          </ConfigProvider>
        </Sider>
      ) : (
        <Header className="flex justify-between items-center bg-blue-600 px-6">
          <button className="text-white">
            <IoMenu className="size-6" />
          </button>
          <Logo onClick={handleClickLogo} />
          <button className="text-white">登入</button>
        </Header>
      )}

      {/* 右側內容區 */}
      <Layout className="bg-gray-100 p-6">
        <Content className="bg-white p-6 rounded-md shadow-md">
          <Breadcrumb
            items={[
              {
                title: <Link to="/departments">門診科別＜</Link>,
              },
            ]}
          />
          <h1 className="text-2xl mb-6">一般內科門診時間表</h1>
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        </Content>
      </Layout>

      {/* Modal 彈出框 */}
      <Modal
        title="掛號資訊"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="確認"
        cancelText="取消"
      >
        {selectedAppointment && (
          <>
            <h3>科別：一般內科</h3>
            <h3>日期：{selectedAppointment.date}</h3>
            <h3>時段：{selectedAppointment.time}</h3>
            <h3>{selectedAppointment.doctor}</h3>
            <Form form={form} layout="vertical">
              <Form.Item
                label="身分證字號"
                name="idNumber"
                rules={[{ required: true, message: "請輸入身分證字號" }]}
              >
                <Input placeholder="請輸入身分證字號" />
              </Form.Item>
              <Form.Item
                label="生日"
                name="birthday"
                rules={[{ required: true, message: "請輸入生日" }]}
              >
                <Input placeholder="請輸入生日" />
              </Form.Item>
              <Form.Item
                label="圖形驗證碼"
                name="captcha"
                rules={[{ required: true, message: "請輸入圖形驗證碼" }]}
              >
                <Row gutter={8}>
                  <Col span={16}>
                    <Input placeholder="請輸入驗證碼" />
                  </Col>
                  <Col span={8}>
                    <Button>刷新驗證碼</Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </Layout>
  );
};

export default ClinicSchedulePage;
