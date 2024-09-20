import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import {
  Layout,
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Flex,
 message,
  Breadcrumb,
} from "antd";

import { useNavigate, Link } from "react-router-dom";
import dayjs from "dayjs";
import { createAppointment } from "../api/appointment"


const { Content } = Layout;
const {Search} = Input


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
const dates = generateDates();

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
const doctorClinicTime1 = dates.reduce((acc, _, index) => {
        acc[`date${index}`] = generateRandomDoctorSlots(); 
        return acc;
      }, {})



const doctorClinicTime2 = dates.reduce((acc, _, index) => {
        acc[`date${index}`] = generateRandomDoctorSlots(); 
        return acc;
      }, {})

const ClinicSchedulePage = () => {
  const navigate = useNavigate();
  const isDesktop = useRWD();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [doctorSchedule, setDoctorSchedule] = useState({
    morning: doctorClinicTime1,
    afternoon: doctorClinicTime2,
  });
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

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

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleSubmit = async (values) => {
    const patientId = values.idNumber
    
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
      navigate("/query", {state: "success"});
    } catch (error) {
      console.error(error);
    }
    
  }

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

  const onSearch = (value) => {
    console.log(value);
    //篩選醫師
    const resultDoctor = { ...doctorSchedule };

    for (let key in doctorSchedule.morning) {
      resultDoctor.morning[key] = doctorSchedule.morning[key].filter((d) =>
        d.doctor.includes(value)
      );
    }
    for (let key in doctorSchedule.afternoon) {
resultDoctor.afternoon[key] = doctorSchedule.afternoon[key].filter((d) =>
  d.doctor.includes(value)
);
    }
  
    
    setDoctorSchedule(resultDoctor)
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
      ...doctorSchedule.morning,
    },
    {
      key: "afternoon",
      time: "下午診",
      ...doctorSchedule.afternoon,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />

      <Layout className="bg-gray-100 p-6">
        {isDesktop && (
          <button className="absolute right-8 top-4" onClick={handleClickLogin}>
            登入
          </button>
        )}
        <Breadcrumb
          items={[
            {
              title: <Link to="/departments">門診科別＜</Link>,
            },
          ]}
        />
        <h1 className="text-2xl mb-6">一般內科門診時間表</h1>
        <Content className="bg-white p-6 rounded-md shadow-md">
          <Search
            placeholder="醫師搜尋"
            allowClear
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
            />
          </div>
        </Content>
      </Layout>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        {selectedAppointment && (
          <Form
            form={form}
            onFinish={handleSubmit}
            labelCol={{ span: 8 }}
            className="w-full max-w-md"
          >
            <h1 className="text-center text-xl font-bold">掛號資訊</h1>
            <div className="my-4 ml-16 text-base">
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
