import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import {
  Layout,
  Avatar,
  Button,
  Radio,
  Table,
  Modal,
  Form,
  Card,
  Input,
  Flex,
  Breadcrumb,
} from "antd";

import { useNavigate, Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
// import { createAppointment } from "../api/appointment";
import { getSchedules } from "../api/schedules";
import { AiOutlineTeam } from "react-icons/ai";
import { LuCalendarDays } from "react-icons/lu";
import { MdPermContactCalendar } from "react-icons/md";
import DatePicker from "../components/DatePicker";
import ReCAPTCHA from "react-google-recaptcha";
import { getDoctorById } from "../api/doctors";


const { Content } = Layout;
const { Search } = Input;
const gridStyle = {
  width: "25%",
  textAlign: "center",
};

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
  const location = useLocation()
  const {specialty} = location.state

  const dates = generateDates();
  const [currentWeek, setCurrentWeek] = useState(0);
  const weekDates = dates.slice(currentWeek * 7, (currentWeek + 1) * 7);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [schedules, setSchedules] = useState([]);
  const [displayMode, setDisplayMode] = useState("schedule");
  const [visitType, setVisitType] = useState("initial");

  const [form] = Form.useForm();
  // const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const getSchedulesAsync = async () => {
      try {
        const schedules = await getSchedules(specialty);
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
      className: "min-w-20",
    },
    ...weekDates.map((date, index) => ({
      title: date,
      dataIndex: `date${index}`,
      key: `date${index}`,
      className: "min-w-44",
      render: (doctors, record) =>
        doctors.map((doc, idx) => (
          <Flex key={idx} className="my-2">
            <Button onClick={() => handleClickDoctorInfo(doc.doctorId)} size="small" className="mr-1">
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

  // 生成上午診與下午診的表格資料源
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

  const handleClickDoctorInfo = (id) => {
    const getDoctorByIdAsync = async () => {
      try {
        const doctor = await getDoctorById(id);
        setSelectedDoctor(doctor);
      } catch (error) {
        console.error(error);
      }
    };
    getDoctorByIdAsync();
setIsDoctorModalOpen(true)
  }

  const handleCancel = (value) => {
    if(value === "doctor") {
      setIsDoctorModalOpen(false) 
      setSelectedDoctor(null)}

    setIsModalOpen(false);
    form.resetFields();
  };
  // const handleSubmit = async (values) => {
  //   const patientId = values.idNumber;

  //   try {
  //     await createAppointment({
  //       ...selectedAppointment,
  //       patientId,
  //     });
  //     setIsModalOpen(false);
  //     form.resetFields();
  //     messageApi.open({
  //       type: "success",
  //       content: "掛號成功",
  //     });
  //     navigate("/query", { state: "success" });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
    const resultDoctor = schedules.filter((s) => s.doctorName.includes(value));

    if (resultDoctor.length === 0) return;

    setSchedules(resultDoctor);
  };

  const groupedSchedulesForList = schedules.reduce((acc, schedule) => {
    //重整班表資料給列表渲染使用
    if (!acc[schedule.doctorId]) {
      acc[schedule.doctorId] = {
        doctorId: schedule.doctorId,
        doctorName: schedule.doctorName,
        specialty: schedule.specialty,
        schedules: [],
      };
    }
    const groupSchedule = {
      doctorScheduleId: schedule.doctorScheduleId,
      date: `${dayjs(schedule.date).format("M/D")}(${"日一二三四五六".charAt(
        dayjs(schedule.date).day()
      )})`,
      scheduleSlot: schedule.scheduleSlot.includes("Morning") ? "上午" : "下午",
      bookedAppointments: schedule.bookedAppointments,
      maxAppointments: schedule.maxAppointments,
      status: schedule.status,
    };
    acc[schedule.doctorId].schedules.push(groupSchedule);
    return acc;
  }, {});

  const doctorListData = Object.values(groupedSchedulesForList);

  const onChange = (value) => {
  console.log("Captcha value:", value);
}
 const handleVisitTypeChange = (e) => {
   setVisitType(e.target.value); 
 };


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
        <h1 className="text-2xl mb-6">{specialty}門診</h1>
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
          {displayMode === "schedule" && (
            <div className="flex justify-between my-4">
              <Button onClick={handlePreviousWeek} disabled={currentWeek === 0}>
                上一週
              </Button>
              <Button onClick={handleNextWeek} disabled={currentWeek === 1}>
                下一週
              </Button>
            </div>
          )}

          <div className="overflow-x-auto">
            {displayMode === "schedule" ? (
              <Table
                bordered
                tableLayout="auto"
                columns={columns}
                dataSource={dataSource}
                pagination={false}
              />
            ) : (
              doctorListData.map((d) => (
                <Card
                  className="my-4"
                  key={d.doctorId}
                  title={d.doctorName + " 醫師"}
                >
                  {d.schedules.map((schedule) => (
                    <Card.Grid
                      key={schedule.doctorScheduleId}
                      style={gridStyle}
                    >
                      <Button
                        onClick={() =>
                          handleAppointment({
                            date: schedule.date,
                            doctor: d.doctorName,
                            time: schedule.scheduleSlot,
                          })
                        }
                      >
                        {schedule.date}
                        <br />
                        {schedule.scheduleSlot}
                        <br />
                        已掛號{schedule.bookedAppointments}人
                      </Button>
                    </Card.Grid>
                  ))}
                  <Card.Grid hoverable={false} style={gridStyle}>
                    已滿
                  </Card.Grid>
                  <Card.Grid hoverable={false} style={gridStyle}>
                    已滿
                  </Card.Grid>
                  <Card.Grid hoverable={false} style={gridStyle}>
                    已滿
                  </Card.Grid>
                </Card>
              ))
            )}
          </div>
        </Content>
      </Layout>

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        {selectedAppointment && (
          <Form
            form={form}
            // onFinish={handleSubmit}
            labelCol={{ span: 8 }}
            className="w-full max-w-md"
          >
            <h1 className="text-center text-xl font-bold">掛號資訊</h1>
            <div className="my-4 text-center text-lg">
              <h3>一般內科</h3>
              <p>
                {selectedAppointment.date}
                {selectedAppointment.time}
              </p>
              <h3>{selectedAppointment.doctor} 醫師</h3>
            </div>
            <Form.Item
              name="visitType"
              label="就診類別"
              rules={[{ required: true, message: "請選擇就診類別" }]}
            >
              <Radio.Group onChange={handleVisitTypeChange} value={visitType}>
                <Radio value={"initial"}>初診</Radio>
                <Radio value={"return"}>複診</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="身分證字號"
              name="idNumber"
              rules={[{ required: true, message: "請輸入身分證字號" }]}
            >
              <Input placeholder="請輸入身分證字號" />
            </Form.Item>
            <Form.Item label="生日" name="birthday">
              <DatePicker form={form} />
            </Form.Item>
            <ReCAPTCHA
              className="my-4 ml-20"
              sitekey="Your client site key"
              onChange={onChange}
            />
            <Form.Item>
              <Flex gap="middle" justify="center">
                <Button onClick={handleCancel}>取消</Button>

                <Button type="primary" htmlType="submit">
                  送出
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        )}
      </Modal>
      {selectedDoctor && (
        <Modal
          open={isDoctorModalOpen}
          onCancel={() => handleCancel("doctor")}
          footer={null}
        >
          <div className="p-4">
            <h3 className="text-2xl">{selectedDoctor.name} 醫師</h3>
            <Avatar
              shape="square"
              size={100}
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${selectedDoctor.id}`}
              alt={`${selectedDoctor.name}照片`}
              style={{ width: "100px", marginBottom: "10px" }}
            />
            <div className="my-4 text-base">
              <p>科別： {selectedDoctor.specialty}</p>
              <p>專長：{JSON.parse(selectedDoctor.description).join("、")}</p>
            </div>
            <h4 className="text-lg my-4">可看診時間:</h4>
            {/* <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                /> */}
            {/* <ul>
                {selectedDoctor.availableTimes.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul> */}
            {/* </div> */}
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default ClinicSchedulePage;
