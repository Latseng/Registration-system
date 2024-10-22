import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Radio,
  Table,
  Form,
  Card,
  Input,
  Flex,
  message,
  Breadcrumb,
} from "antd";

import { useNavigate, Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { createAppointment, createFirstAppointment } from "../api/appointments";
import { getSchedules } from "../api/schedules";
import { AiOutlineTeam } from "react-icons/ai";
import { LuCalendarDays } from "react-icons/lu";
import { MdPermContactCalendar } from "react-icons/md";
import { getDoctorById } from "../api/doctors";
import { useDispatch } from "react-redux";
import { setNewAppointment } from "../store/appointmentSlice";
import SelectedModal from "../components/SelectedModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [displayMode, setDisplayMode] = useState("schedule");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("");
  const [isScheduleLoaing, setScheduleLoading] = useState(true)
  const [isFirstCreateAppointment, setIsFirstCreateAppointment] = useState(false)
  const [isModalLoading, setIsModalLoading] = useState(false)
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

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

  const getSchedulesAsync = async () => {
     
    try {
     
      const schedules = await getSchedules(specialty);
      setSchedules(schedules);
      setScheduleLoading(false)
      
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!searchValue) {
     getSchedulesAsync();
    }
    
  }, [searchValue]);

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
            <Button
              onClick={() => handleClickDoctorInfo(doc.doctorId)}
              size="small"
              className="mr-1"
            >
                <MdPermContactCalendar className="text-xl" /> 
            </Button>
            <Button
              onClick={() =>
                handleAppointment({
                  id: doc.doctorScheduleId,
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
    setSelectedDoctor(null)
    setSelectedAppointment(appointment);
    setIsModalOpen(true)
  };

  const handleClickDoctorInfo = (id) => {
    setIsModalLoading(true);
    const getDoctorByIdAsync = async () => {
      try {
        const doctor = await getDoctorById(id);
        const weekDay = ["日", "一", "二", "三", "四", "五", "六"];
        const organizedSchedules = doctor.schedules.map((s) => {
          const formattedDate =
            dayjs(s.date).format("M/D") +
            "（" +
            weekDay[dayjs(s.date).day()] +
            "）";
          const formattedSlot = s.scheduleSlot.includes("Morning")
            ? "上午診"
            : "下午診";
          return { ...s, date: formattedDate, scheduleSlot: formattedSlot };
        });
        const organizedDoctor = { ...doctor, schedules: organizedSchedules };
        setSelectedDoctor(organizedDoctor);
        
        setIsModalLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getDoctorByIdAsync();
setIsModalOpen(true)
  }

  const handleCancel = () => {
    
      setIsModalOpen(false) 
      setSelectedDoctor(null)

    setSelectedAppointment(null)
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setIsSubmitLoading(true)
    const birthDate = new Date(
      Date.UTC(values.year, values.month - 1, values.day)
    ).toISOString();
    
    let requestData = {
      idNumber: values.idNumber,
      birthDate: birthDate,
      recaptchaResponse: "test_recaptcha",
      doctorScheduleId: selectedAppointment.id,
    };
    
     if (isFirstCreateAppointment) {
      requestData = {
        idNumber: values.idNumber,
        birthDate: birthDate,
        recaptchaResponse: "test_recaptcha",
        doctorScheduleId: selectedAppointment.id,
        name: values.name,
        contactInfo: values.number
      };
      const newFistAppointment = await createFirstAppointment(requestData);
      console.log(newFistAppointment);
      return
     } 
     
     const newAppointment =  await createAppointment(requestData);
     console.log(newAppointment);
     
     if (newAppointment === "You have already booked this time slot."){
      messageApi.open({
        type: "warning",
        content: "重複掛號",
      });
      setIsSubmitLoading(false);
      return
     } 
     if(typeof newAppointment === "string" && newAppointment.includes('初診')) {
      setIsFirstCreateAppointment(true)
     }

      form.resetFields();

      dispatch(
        setNewAppointment({
          ...newAppointment,
          requestData: {
            idNumber: requestData.idNumber,
            birthDate: requestData.birthDate,
            recaptchaResponse: requestData.recaptchaResponse
          },
        })
      );
      navigate("/query");
    
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
  const warning = (value) => {
    messageApi.open({
      type: "warning",
      content: value,
    });
  };
  const handleSearch = (value, _, {source}) => {
    if (source === "clear") return;
    const filteredData = value.trim();
    if (filteredData.length === 0) return warning("請輸入有效關鍵字");
    const resultData = schedules.filter((s) => s.doctorName.includes(filteredData));
if (resultData.length === 0) return warning("查無此醫師");
    setSchedules(resultData);
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

 const handleSearchChange = (event) => {
   setSearchValue(event.target.value);
 };

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Sidebar
        items={items}
        onClickPage={handleClickPage}
        onClickLogo={handleClickLogo}
      />

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
              onSearch={handleSearch}
              onChange={(event) => handleSearchChange(event)}
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
                loading={isScheduleLoaing}
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
                            id: schedule.doctorScheduleId,
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
      <SelectedModal
        selectedDoctor={selectedDoctor}
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleAppointment={handleAppointment}
        selectedAppointment={selectedAppointment}
        handleSubmit={handleSubmit}
        isFirstCreateAppointment={isFirstCreateAppointment}
        onChange={onChange}
        isModalLoading={isModalLoading}
        isSubmitLoading={isSubmitLoading}
      />
    </Layout>
  );
};

export default ClinicSchedulePage;
