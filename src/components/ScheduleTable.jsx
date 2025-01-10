import { Table, Button, Flex, Modal, Form, Select, InputNumber } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getSchedules, createSchedule, deleteSchedule } from "../api/schedules";
import { searchDoctors } from "../api/doctors";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = dayjs().add(i, "day");
    const formattedDate = `${date.format("M/D")}(${"日一二三四五六".charAt(
      date.day()
    )})`;

    dates.push(formattedDate);
  }
  return dates;
};

const ScheduleTable = () => {
  const [isScheduleLoading, setScheduleLoading] = useState(false);
  const dates = generateDates();
  const [currentWeek, setCurrentWeek] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [departmentDoctorData, setDepartmentDoctorData] = useState([]);
  const [scheduledDoctor, setScheduledDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState({});
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [isScheduleEditModalOpen, setIsScheduleEditModalOpen] = useState(false);
  const [isSelectedDoctorModalOpen, setIsSelectedDoctorModalOpen] =
    useState(false);
  const [scheduleData, setScheduleData] = useState({
    doctorId: null,
    scheduleSlot: "",
    date: "",
    maxAppointments: 0,
    status: "",
  });
  const location = useLocation();
  const { specialty } = location.state;
  const weekDates = dates.slice(currentWeek * 7, (currentWeek + 1) * 7);
  const [form] = Form.useForm();

  useEffect(() => {
    const getDoctorDataByDepartment = async () => {
      try {
        const doctorData = await searchDoctors(specialty);
        setDepartmentDoctorData(
          doctorData.map((d) => ({
            id: d.id,
            name: d.name,
            specialty: d.specialty,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    const getSchedulesAsync = async () => {
      try {
        setScheduleLoading(true);
        const scheduleData = await getSchedules(specialty);
        setSchedules(scheduleData);
        setScheduleLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (isDataUpdated) {
      getSchedulesAsync();
    }
    getSchedulesAsync();
    getDoctorDataByDepartment();
  }, [isDataUpdated, specialty]);

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
      className: "min-w-20",
      render: (text, record) => (
        <>
          {text.length > 0 ? (
            <>
              {text.map((item, idx) => (
                <Flex
                  key={idx}
                  justify="center"
                  className="my-2 border border-gray-200"
                >
                  <Button type="text" onClick={() => handleEdit(item)}>
                    {item.doctorName}
                  </Button>
                  <Button
                    type="text"
                    onClick={() => openDeleteConfirmModal(item)}
                    danger
                  >
                    刪除
                  </Button>
                </Flex>
              ))}
              <Flex justify="center" className="my-2">
                <Button
                  onClick={() => handleAddSchedule(record.time, date, text)}
                >
                  <IoIosAdd
                    className="text-gray-400 hover:text-mainColorLight"
                    size={24}
                  />
                </Button>
              </Flex>
            </>
          ) : (
            <Flex justify="center" className="my-2">
              <Button onClick={() => handleAddSchedule(record.time, date)}>
                <IoIosAdd
                  className="text-gray-400 hover:text-mainColorLight"
                  size={24}
                />
              </Button>
            </Flex>
          )}
        </>
      ),
    })),
  ];

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

  const handleEdit = (value) => {
    console.log(value);
    setSelectedDoctor(value);
    setIsSelectedDoctorModalOpen(true);
  };

  const handleAddSchedule = (value1, value2, value3) => {
    //避免同一時段的醫師門診重複
    if (value3) {
      setScheduledDoctor(
        value3?.map((i) => ({ doctorId: i.doctorId, doctorName: i.doctorName }))
      );
    }
    let scheduleSlot = "";
    if (value1.includes("上午")) {
      scheduleSlot =
        dayjs(`2024-${value2}`, "YYYY-M/D ").format("dddd") + "_Morning";
    } else {
      scheduleSlot =
        dayjs(`2024-${value2}`, "YYYY-M/D ").format("dddd") + "_Afternoon";
    }
    const date = dayjs(
      dayjs(`2024-${value2}`, "YYYY-M/D").format("YYYY-MM-DD")
    ).toISOString();
    setScheduleData({
      ...scheduleData,
      scheduleSlot: scheduleSlot,
      date: date,
      status: "AVAILABLE",
    });
    setIsScheduleEditModalOpen(true);
  };

  const handleAddScheduleSubmit = async () => {
    await createSchedule(
      scheduleData,
      JSON.parse(localStorage.getItem("userData")).adminToken
    );
    setScheduleData({
      doctorId: null,
      scheduleSlot: "",
      date: "",
      maxAppointments: 0,
      status: "",
    });
    form.resetFields();
    setIsDataUpdated(!isDataUpdated);
    setIsScheduleEditModalOpen(false);
  };

  const handleScheduleDelete = async (id, adminToken) => {
    await deleteSchedule(id, adminToken);
    setIsDataUpdated(!isDataUpdated);
  };

  const openDeleteConfirmModal = (text) => {
    confirm({
      title: "資料刪除確認？",
      icon: <ExclamationCircleFilled />,
      content: "你確定要刪除這筆門診資料？",
      okText: "確定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        handleScheduleDelete(
          text.doctorScheduleId,
          JSON.parse(localStorage.getItem("userData")).adminToken
        );
      },
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => (prev < 1 ? prev + 1 : prev));
  };

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const handleDoctorChange = (value) => {
    setScheduleData({ ...scheduleData, doctorId: value });
    //  setSelectedDoctor(value);
  };
  const handleMaxAppointmentsChange = (value) => {
    setScheduleData({ ...scheduleData, maxAppointments: value });
  };

  const handleScheduleEditModalClose = () => {
    setIsScheduleEditModalOpen(false);
    setScheduledDoctor([]);
    setScheduleData({
      doctorId: null,
      scheduleSlot: "",
      date: "",
      maxAppointments: 0,
      status: "",
    });
    form.resetFields();
  };

  return (
    <>
      <div className="flex justify-between my-4">
        <Button onClick={handlePreviousWeek} disabled={currentWeek === 0}>
          上一週
        </Button>
        <Button onClick={handleNextWeek} disabled={currentWeek === 1}>
          下一週
        </Button>
      </div>
      <div className="overflow-x-auto bg-white">
        <Table
          bordered
          loading={isScheduleLoading}
          tableLayout="auto"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </div>
      {/* 新增門診 */}
      <Modal
        className="text-center px-24"
        title="門診設定"
        open={isScheduleEditModalOpen}
        onCancel={handleScheduleEditModalClose}
        footer={null}
      >
        <Form
          form={form}
          className="pt-8"
          initialValues={{
            selectField: "請選擇醫師",
            inputMaxAppointments: 0,
          }}
          onFinish={handleAddScheduleSubmit}
        >
          <Form.Item name="selectField" label="醫師">
            <Select
              style={{
                width: 160,
              }}
              onChange={handleDoctorChange}
              options={departmentDoctorData.map((data) => ({
                value: data.id,
                label: data.name,
                disabled: scheduledDoctor.some((i) => i.doctorId === data.id),
              }))}
            />
          </Form.Item>
          <Form.Item name="inputMaxAppointments" label="看診人數上限">
            <InputNumber
              className="mx-6"
              min={1}
              max={10}
              onChange={handleMaxAppointmentsChange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              disabled={
                scheduleData.maxAppointments === 0 ||
                scheduleData.doctorId === null
              }
              className="w-1/2"
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* 修改門診 */}
      <Modal
        className="text-center p-24"
        open={isSelectedDoctorModalOpen}
        onCancel={() => setIsSelectedDoctorModalOpen(false)}
        title="門診設定"
      >
        <h2>門診醫師：{selectedDoctor.doctorName}</h2>
        <Form
          form={form}
          className="pt-8"
          initialValues={{
            inputMaxAppointments: selectedDoctor.maxAppointments,
          }}
        >
          <Form.Item name="inputMaxAppointments" label="看診人數上限">
            <InputNumber className="mx-6" min={1} max={10} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

ScheduleTable.propTypes = {
  specialty: PropTypes.string,
};

export default ScheduleTable;
