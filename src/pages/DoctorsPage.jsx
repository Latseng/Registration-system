import { Layout, List, Card, message, Button, Input, Avatar, Modal } from "antd";
import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDoctors, searchDoctors, getDoctorById } from "../api/doctors";
import dayjs from "dayjs";
import SelectedDoctorModal from "../components/SelectedDoctorModal";

const { Content } = Layout;
const { Search } = Input;


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

const DoctorsPage = () => {
  const isDesktop = useRWD();
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("");
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

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
   setIsDoctorModalOpen(true);
  };

  const handleCancel = () => {
    setIsDoctorModalOpen(false);
  };

  const handleClickLogo = () => {
    navigate("/*");
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
    //  setSelectedAppointment(appointment);
    //  setIsModalOpen(true);
     setIsDoctorModalOpen(false);
   };
  // const handleSearch = (value, _, { source }) => {
  //   if (source === "clear") return;
  //   const filteredData = value.trim();
  //   if (filteredData.length === 0) return warning("請輸入有效關鍵字");
  //   const resultData = schedules.filter((s) =>
  //     s.doctorName.includes(filteredData)
  //   );
  //   if (resultData.length === 0) return warning("查無此醫師");
  //   setSchedules(resultData);
  // };
  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Sidebar
        items={items}
        onClickPage={handleClickPage}
        onClickLogo={handleClickLogo}
      />
      {isDesktop && (
        <button className="absolute right-8 top-4" onClick={handleClickLogin}>
          登入
        </button>
      )}
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
        {selectedDoctor && (
          <SelectedDoctorModal
            selectedDoctor={selectedDoctor}
            isDoctorModalOpen={isDoctorModalOpen}
            handleCancel={handleCancel}
            handleAppointment={handleAppointment}
          />
        )}
      </Content>
    </Layout>
  );
};

export default DoctorsPage;
