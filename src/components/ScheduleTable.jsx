import { Table } from "antd";
import { useState } from "react";

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

const ScheduleTable = () => {
  const [isScheduleLoading, setScheduleLoading] = useState(false);


  return (
    <>
      <Table
        bordered
        loading={isScheduleLoading}
        tableLayout="auto"
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </>
  );
};

export default ScheduleTable;
