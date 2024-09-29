import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Radio,
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
import { createAppointment } from "../api/appointment";
import { getSchedules } from "../api/schedules";
import { AiOutlineTeam } from "react-icons/ai";
import { LuCalendarDays } from "react-icons/lu";
import { MdPermContactCalendar } from "react-icons/md";

const { Content } = Layout;
const { Search } = Input;

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = dayjs("2024-09-01").add(i, "day");
    const formattedDate = `${date.format("M/D")}(${"日一二三四五六".charAt(
      date.day()
    )})`;

    dates.push(formattedDate);
  }
  return dates;
};

const ClinicSchedulePage = () => {
  const navigate = useNavigate();
  const isDesktop = useRWD();

  const dates = generateDates();
  const [currentWeek, setCurrentWeek] = useState(0);
  const weekDates = dates.slice(currentWeek * 7, (currentWeek + 1) * 7);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [schedules, setSchedules] = useState([]);
  const [displayMode, setDisplayMode] = useState("schedule");

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getSchedulesAsync = async () => {
      try {
        const schedules = await getSchedules();
        setSchedules(schedules);
      } catch (error) {
        console.error(error);
      }
    };
    getSchedulesAsync();
  }, []);

  const mapSchedulesToSlots = (schedules, time, dates) => {
    return dates.reduce((acc, date, index) => {
      const filteredSchedules = schedules.filter(
        (schedule) =>
          schedule.scheduleSlot.includes(time) &&
          dayjs(schedule.date).format("M/D") === date.split("(")[0]
      );
      acc[`date${index}`] = filteredSchedules;
      return acc;
    }, {});
  };

  const columns = [
    {
      title: "時間",
      dataIndex: "time",
      key: "time",
      fixed: "left",
    },
    ...weekDates.map((date, index) => ({
      title: date,
      dataIndex: `date${index}`,
      key: `date${index}`,
      render: (doctors, record) =>
        doctors.map((doc, idx) => (
          <Flex key={idx}>
            <Button size="small" className="mr-1">
              <MdPermContactCalendar className="text-xl" />
            </Button>
            <Button
              onClick={() =>
                handleAppointment({
                  date: date,
                  doctor: doc.doctorName,
                  time: record.time,
                })
              }
              size="small"
              disabled={doc.bookedAppointments >= doc.maxAppointments}
            >
              {doc.doctorName} <br />{" "}
              {doc.bookedAppointments >= doc.maxAppointments
                ? "額滿"
                : `掛號人數: ${doc.bookedAppointments}`}
            </Button>
          </Flex>
        )),
    })),
  ];

  // 生成上午診與下午診的資料源
  const dataSource = [
    {
      key: "morning",
      time: "上午診",
      ...mapSchedulesToSlots(schedules, "Morning", weekDates),
    },
    {
      key: "afternoon",
      time: "下午診",
      ...mapSchedulesToSlots(schedules, "Afternoon", weekDates),
    },
  ];

  const handleNextWeek = () => {
    setCurrentWeek((prev) => (prev < 1 ? prev + 1 : prev));
  };

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => (prev > 0 ? prev - 1 : prev));
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
    const patientId = values.idNumber;

    try {
      await createAppointment({
        ...selectedAppointment,
        patientId,
      });
      setIsModalOpen(false);
      form.resetFields();
      messageApi.open({
        type: "success",
        content: "掛號成功",
      });
      navigate("/query", { state: "success" });
    } catch (error) {
      console.error(error);
    }
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

  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickLogo = () => {
    navigate("/*");
  };
  const onSearch = (value) => {
    const resultDoctor = schedules.filter((s) => 
      s.doctorName.includes(value)
    )
    
    if (resultDoctor.length === 0) return 

    setSchedules(resultDoctor);
  };

  // const columns = [
  //   {
  //     title: "時間",
  //     dataIndex: "time",
  //     key: "time",
  //     fixed: "left",
  //   },
  //   ...dates.map((date, index) => ({
  //     title: date,
  //     dataIndex: `date${index}`,
  //     key: `date${index}`,
  //     render: (_, record) => {
  //       const doctorSlot = record[`date${index}`];

  //       return doctorSlot.map(({ doctor, numOfPatients, isFull }, idx) => (
  //         <Flex className="my-2" key={idx} align={"center"}>
  //           <Button className="mr-1" size="small">
  //             <MdPermContactCalendar className="text-xl" />
  //           </Button>
  //           <Button
  //             size="small"
  //             onClick={() =>
  //               handleAppointment({
  //                 date: date,
  //                 doctor: doctor,
  //                 time: record.time,
  //               })
  //             }
  //             disabled={isFull}
  //           >
  //             {doctor} <br /> {isFull ? "額滿" : `掛號人數: ${numOfPatients}`}
  //           </Button>
  //         </Flex>
  //       ));
  //     },
  //   })),
  // ];

  // const dataSource = [
  //   {
  //     key: "morning",
  //     time: "上午診",
  //     ...doctorSchedule.morning,
  //   },
  //   {
  //     key: "afternoon",
  //     time: "下午診",
  //     ...doctorSchedule.afternoon,
  //   },
  // ];

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
        <h1 className="text-2xl mb-6">一般內科門診</h1>
        <Content className="bg-white p-4 rounded-md shadow-md">
          <Flex justify={"space-between"}>
            <Search
              placeholder="醫師搜尋"
              onSearch={onSearch}
              allowClear
              style={{
                width: 200,
              }}
            />
            <Radio.Group
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
            >
              <Radio.Button value="schedule">
                <LuCalendarDays className="text-xl mt-1" />
              </Radio.Button>
              <Radio.Button value="doctorList">
                <AiOutlineTeam className="text-xl mt-1" />
              </Radio.Button>
            </Radio.Group>
          </Flex>
          <div className="flex justify-between my-4">
            <Button onClick={handlePreviousWeek} disabled={currentWeek === 0}>
              上一週
            </Button>
            <Button onClick={handleNextWeek} disabled={currentWeek === 1}>
              下一週
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table
              bordered
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
              <h3>醫師：{selectedAppointment.doctor}</h3>
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
