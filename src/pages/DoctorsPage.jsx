import { Layout, List, message, Button, Input, Avatar, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDoctors, searchDoctors, getDoctorById } from "../api/doctors";
import { createAppointment, createFirstAppointment } from "../api/appointments";
import dayjs from "dayjs";
import SelectedModal from "../components/SelectedModal";
import { useDispatch } from "react-redux";
import { setNewAppointment } from "../store/appointmentSlice";
import LoginButton from "../components/LoginButton";

const { Content } = Layout;
const { Search } = Input;

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isFirstCreateAppointment, setIsFirstCreateAppointment] =
    useState(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  useEffect(() => {
    const getDoctorsData = async () => {
      try {
        setIsLoading(true)
        const response = await getDoctors()
        setDoctors(response.data)
        setIsLoading(false)
        
      } catch(error) {
        console.error(error);
        
      }
    }
     if (!searchValue) {
       getDoctorsData();
     }
   
  }, [searchValue])

  const data = doctors.map((d) => ({
    doctorId: d.id,
    href: "https://ant.design",
    title: `${d.name} 醫師`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${d.id}`,
    description: d.specialty,
    content: `專長： ${JSON.parse(d.description).join('、')}`,
  }));

  const showDoctorInfo = async (id) => {
    setIsModalOpen(true);
    setIsModalLoading(true);
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
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null)
  };
  const warning = (value) => {
    messageApi.open({
      type: "warning",
      content: value,
    });
  }
  
  const handleSearch = async (value, _, {source}) => {
    if(source === "clear") return;
    const filteredData = value.trim();
    if(filteredData.length === 0) return warning("請輸入有效關鍵字")
      const resultData = await searchDoctors(filteredData)
    if (resultData.length === 0) return warning("查無此醫師");
    setDoctors(
      resultData
    );
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

   const handleAppointment = (appointment) => {
     setSelectedDoctor(null);
     setSelectedAppointment(appointment);
   };

    const handleSubmit = async (values) => {
      setIsSubmitLoading(true);
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
          contactInfo: values.number,
        };
        const newFistAppointment = await createFirstAppointment(requestData);
        console.log(newFistAppointment);
        return;
      }

      const newAppointment = await createAppointment(requestData);

      if (newAppointment === "You have already booked this time slot.") {
        messageApi.open({
          type: "warning",
          content: "重複掛號",
        });
        setIsSubmitLoading(false);
        return
      }
        
      if (
        typeof newAppointment === "string" &&
        newAppointment.includes("初診")
      ) {
        setIsFirstCreateAppointment(true);
      }

      form.resetFields();
      messageApi.open({
        type: "success",
        content: "掛號成功",
      });

      dispatch(
        setNewAppointment({
          ...newAppointment,
          requestData: {
            idNumber: requestData.idNumber,
            birthDate: requestData.birthDate,
            recaptchaResponse: requestData.recaptchaResponse,
          },
        })
      );
      navigate("/query");
    };
    const onChange = (value) => {
      console.log("Captcha value:", value);
    };
  
  return (
    <>
      {contextHolder}
     <LoginButton />
      <Content className="bg-gray-100 p-6">
        <h1 className="text-2xl mb-6">醫師專長查詢</h1>
        <Search
          className="mb-2"
          placeholder="醫師搜尋"
          allowClear
          onSearch={handleSearch}
          onChange={(event) => handleSearchChange(event)}
          style={{
            width: 200,
          }}
        />

        <List
          className="bg-white pb-4"
          itemLayout="vertical"
          size="large"
          loading={isLoading}
          pagination={{
            pageSize: 5,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item className="relative" key={item.title}>
              <Avatar shape="square" size={64} src={item.avatar} />
              <div className="absolute left-24 top-10 flex flex-wrap items-center w-6/12">
                <h4 className="text-lg">{item.title}</h4>
                <p className="text-black text-base mx-8">{item.description}</p>
              </div>
              <Button
                className="absolute right-8 top-8"
                onClick={() => showDoctorInfo(item.doctorId)}
              >
                詳細資訊
              </Button>
            </List.Item>
          )}
        />
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
      </Content>
    </>
  );
};

export default DoctorsPage;
