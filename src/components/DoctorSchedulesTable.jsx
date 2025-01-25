import { Table, Button } from "antd"
import { getSchedulesByDoctor } from "../api/schedules"
import { generateDates, mapSchedulesToSlots } from "../helper/dateUtils";
import { useEffect, useState } from "react"

const dates = generateDates();//兩個禮拜的日期陣列

const DoctorSchedulesTable = ({ doctorId, handleAppointment }) => {
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  //兩個禮拜分割成各一個禮拜
  const weekDates = dates.slice(currentWeek * 5, (currentWeek + 1) * 5);

  const handleNextWeek = () => {
    setCurrentWeek((prev) => (prev < 1 ? prev + 1 : prev));
  };

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    setScheduleLoading(true);
    const getSchedulesByDoctorData = async () => {
      try {
        const scheduleData = await getSchedulesByDoctor(doctorId);
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
    getSchedulesByDoctorData();
  }, [doctorId]);

  const columns = [
    {
      title: "時間",
      dataIndex: "time",
      key: "time",
      fixed: "left",
      className: "w-20",
    },
    ...weekDates.map((date, index) => ({
      title: date,
      dataIndex: `date${index}`,
      key: `date${index}`,
      className: "text-center",
      render: (text) =>
        text.map((doctorSchedule, idx) => (
          <div key={idx} className="flex justify-center">
            <Button
              size="small"
              disabled={doctorSchedule.bookedAppointments >= doctorSchedule.maxAppointments}
              onClick={() => handleAppointment(doctorSchedule)}
            >
              {doctorSchedule.bookedAppointments >= doctorSchedule.maxAppointments
                ? "額滿"
                : `掛號人數: ${doctorSchedule.bookedAppointments}`}
            </Button>
          </div>
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
  return (
    <div className="p-4 shadow-md">
      <Table
        className="border rounded"
        title={() => "可掛號時段"}
        columns={columns}
        dataSource={dataSource}
        loading={scheduleLoading}
        scroll={{ x: 800 }}
        pagination={false}
      />
      <div className="flex justify-between my-4">
        <Button onClick={handlePreviousWeek} disabled={currentWeek === 0}>
          上一週
        </Button>
        <Button onClick={handleNextWeek} disabled={currentWeek === 1}>
          下一週
        </Button>
      </div>
    </div>
  );
};

export default DoctorSchedulesTable