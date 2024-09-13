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
  DatePicker,
  Flex,
 message,
  Breadcrumb,
  ConfigProvider,
} from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import { createAppointment } from "../api/appointment"


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
  const [messageApi, contextHolder] = message.useMessage();

  // const handleClickLogin = () => {
  //   navigate("/login");
  // };
  const handleClickLogo = () => {
    navigate("/*");
  };

  

  const handleAppointment = (appointment) => {
   setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleSubmit = async (values) => {
    const patientId = values.idNumber
    console.log(patientId);
    
    try {
     await createAppointment({
      ...selectedAppointment,
      patientId
      })
      setIsModalOpen(false);
      form.resetFields();
      messageApi.open({
        type: "success",
        content: "掛號成功",
      });
      navigate("/query");
    } catch (error) {
      console.error(error);
    }
    
  }

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
      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        {selectedAppointment && (
          <Form
            form={form}
            onFinish={handleSubmit}
            labelCol={{ span: 8 }}
            className="w-full max-w-md"
          >
            <h1 className="text-center text-xl font-bold">掛號資訊</h1>
            <div className="mb-3 ml-16 text-base">
              <h3>科別：一般內科</h3>
              <h3>日期：{selectedAppointment.date}</h3>
              <h3>時段：{selectedAppointment.time}</h3>
              <h3>{selectedAppointment.doctor}</h3>
            </div>
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
              rules={[{ required: true, message: "請選擇生日" }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item>
              <Flex gap="middle" justify="center">
                <Button onClick={handleCancel}>取消</Button>
                {contextHolder}
                <Button type="primary" htmlType="submit">
                  送出
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Layout>
  );
};

export default ClinicSchedulePage;
