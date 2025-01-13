import { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Radio,
  Table,
  Card,
  Input,
  Flex,
  message,
  Breadcrumb,
} from "antd";

import {  Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { getSchedules } from "../api/schedules";
import { AiOutlineTeam } from "react-icons/ai";
import { LuCalendarDays } from "react-icons/lu";
import { MdPermContactCalendar } from "react-icons/md";
import { getDoctorById } from "../api/doctors";
import SelectedModal from "../components/SelectedModal";
import LoginButton from "../components/LoginButton";
import useRWD from "../hooks/useRWD";

const { Content } = Layout;
const { Search } = Input;
const gridStyle = {
  width: "25%",
  textAlign: "center",
};

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = dayjs().add(i, "day");//以當前日期，創建一個起始日期
    const formattedDate = `${date.format("M/D")}(${"日一二三四五六".charAt(
      date.day()
    )})`;

    dates.push(formattedDate);
  }
  return dates;
};

const ClinicSchedulePage = () => {
  const location = useLocation();
  const { specialty } = location.state;
  const dates = generateDates();
  const [currentWeek, setCurrentWeek] = useState(0);
  const weekDates = dates.slice(currentWeek * 7, (currentWeek + 1) * 7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [displayMode, setDisplayMode] = useState("schedule");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isScheduleLoading, setScheduleLoading] = useState(true);
  const [isFirstCreateAppointment, setIsFirstCreateAppointment] =
    useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
const isDesktop = useRWD()

  useEffect(() => {
    const getSchedulesAsync = async () => {
      try {
        const scheduleData = await getSchedules(specialty);
        //如果沒有醫師門診
        if (scheduleData?.length >= 0) {
          setSchedules(scheduleData);
        } else {
          setSchedules([]);
        }
        setScheduleLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (!searchValue) {
      getSchedulesAsync();
    }
  }, [searchValue, specialty]);

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
      render: (text, record) =>
        text.map((doc, idx) => (
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
                  specialty: doc.specialty,
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
    setSelectedDoctor(null);
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
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
    setIsModalOpen(true);
  };

 

  

  const warning = (value) => {
    messageApi.open({
      type: "warning",
      content: value,
    });
  };
  const handleSearch = (value, _, { source }) => {
    if (source === "clear") return;
    const filteredData = value.trim();
    if (filteredData.length === 0) return warning("請輸入有效關鍵字");
    const resultData = schedules.filter((s) =>
      s.doctorName.includes(filteredData)
    );
    if (resultData.length === 0) return warning("查無此醫師");
    setSchedules(resultData);
  };

  //生成新的門診資料供卡片瀏覽使用
  const groupedSchedulesForList = schedules.reduce((acc, schedule) => {
    // 檢查日期是否小於今天
    if (dayjs(schedule.date).isBefore(dayjs(), "day")) {
      return acc; // 跳過這筆資料
    }
    // 如果該醫師的資料還未在累加器中初始化，進行初始化
    if (!acc[schedule.doctorId]) {
      acc[schedule.doctorId] = {
        doctorId: schedule.doctorId,
        doctorName: schedule.doctorName,
        specialty: schedule.specialty,
        schedules: [],
      };
    }
    //生成新的門診物件
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
    //在特定醫師的門診中，加入新門診
    acc[schedule.doctorId].schedules.push(groupSchedule);
    return acc;
  }, {});

  const doctorListData = Object.values(groupedSchedulesForList);
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <>
      <Layout className="bg-gray-100 p-6">
        {contextHolder}
        {isDesktop && <LoginButton />}
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
                loading={isScheduleLoading}
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
                      className="cursor-pointer"
                      style={gridStyle}
                      onClick={() =>
                        handleAppointment({
                          date: schedule.date,
                          doctor: d.doctorName,
                          time: schedule.scheduleSlot,
                          id: schedule.doctorScheduleId,
                        })
                      }
                    >
                      <p>{schedule.date}</p>
                      <p>{schedule.scheduleSlot}診</p>
                      {console.log(d)}
                      <p>已掛號{schedule.bookedAppointments}人</p>
                    </Card.Grid>
                  ))}
                </Card>
              ))
            )}
          </div>
        </Content>
      </Layout>
      <SelectedModal
        selectedDoctor={selectedDoctor}
        isModalOpen={isModalOpen}
        setSelectedDoctor={setSelectedDoctor}
        handleAppointment={handleAppointment}
        selectedAppointment={selectedAppointment}
        setIsSubmitLoading={setIsSubmitLoading}
        isFirstCreateAppointment={isFirstCreateAppointment}
        isModalLoading={isModalLoading}
        isSubmitLoading={isSubmitLoading}
        setIsFirstCreateAppointment={setIsFirstCreateAppointment}
        setSelectedAppointment={setSelectedAppointment}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default ClinicSchedulePage;
