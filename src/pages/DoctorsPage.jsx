import { Layout, List, Button, Input, Table, Avatar, Modal } from "antd";
import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useState } from "react";

const { Content } = Layout;
const { Search } = Input;

const doctorsData = [
  {
    doctorName: "張OO",
    department: "心臟內科",
    specialties: ["心導管手術", "冠狀動脈疾病"],
  },
  {
    doctorName: "陳OO",
    department: "一般內科",
    specialties: ["高血壓", "糖尿病"],
  },
  {
    doctorName: "李OO",
    department: "神經外科",
    specialties: ["腦腫瘤切除手術", "脊椎外科手術"],
  },
  {
    doctorName: "林OO",
    department: "骨科",
    specialties: ["人工關節置換術", "脊椎疾病"],
  },
  {
    doctorName: "王OO",
    department: "皮膚科",
    specialties: ["皮膚病理學", "皮膚癌診療"],
  },
  {
    doctorName: "周OO",
    department: "小兒科",
    specialties: ["兒童過敏", "兒童氣喘"],
  },
  {
    doctorName: "黃OO",
    department: "婦產科",
    specialties: ["產前檢查", "高危險妊娠"],
  },
  {
    doctorName: "吳OO",
    department: "眼科",
    specialties: ["白內障手術", "視網膜疾病"],
  },
  {
    doctorName: "何OO",
    department: "耳鼻喉科",
    specialties: ["鼻竇炎", "耳聾"],
  },
  {
    doctorName: "劉OO",
    department: "泌尿科",
    specialties: ["前列腺疾病", "膀胱癌"],
  },
  {
    doctorName: "徐OO",
    department: "精神科",
    specialties: ["憂鬱症", "焦慮症", "精神分裂症"],
  },
  {
    doctorName: "邱OO",
    department: "內分泌科",
    specialties: ["甲狀腺疾病", "骨質疏鬆症"],
  },
];

const data = doctorsData.map((d, i) => ({
  href: "https://ant.design",
  title: `${d.doctorName} 醫師`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: d.department,
  content: `專長： ${d.specialties.join('、')}`,
}));

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = dayjs().add(i, "day");
    const formattedDate = `${date.format("M/D")}（${"日一二三四五六".charAt(
      date.day()
    )}）`;

    dates.push(formattedDate);
  }
  return dates;
};
const dates = generateDates();

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
    // render: (_, record) => {
    //   const doctorSlot = record[`date${index}`];
    //   return doctorSlot.map(({ numOfPatients, isFull }, idx) => (
    //     <Button
    //       // onClick={() =>
    //       //   handleAppointment({ date: date, doctor: doctor, time: record.time })
    //       // }
    //       key={idx}
    //       type="link"
    //       disabled={isFull}
    //     >
    //       <br /> {isFull ? "額滿" : `掛號人數: ${numOfPatients}`}
    //     </Button>
    //   ));
    // },
  })),
];
const dataSource = [
  {
    key: "morning",
    time: "上午診",
    // ...doctorSchedule.morning,
  },
  {
    key: "afternoon",
    time: "下午診",
    // ...doctorSchedule.afternoon,
  },
];

const DoctorsPage = () => {
  const isDesktop = useRWD();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const showDoctorInfo = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
  const handleSearch = () => {
    console.log("搜尋醫師中");
  };
  return (
    <Layout className="min-h-screen">
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />
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
          style={{
            width: 200,
          }}
        />

        <List
          className="bg-white pb-4"
          itemLayout="vertical"
          size="large"
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
                onClick={() => showDoctorInfo(item)}
              >
                詳細資訊
              </Button>
            </List.Item>
          )}
        />
        {selectedDoctor && (
          <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
            <div className="p-4">
              <h2 className="text-2xl">{selectedDoctor.title}</h2>
              <Avatar
                shape="square"
                size={100}
                src={selectedDoctor.avatar}
                alt={`${selectedDoctor.title}照片`}
                style={{ width: "100px", marginBottom: "10px" }}
              />
              <div className="my-4 text-base">
                <p>科別： {selectedDoctor.description}</p>
                <p>{selectedDoctor.content}</p>
              </div>
              <h4 className="text-lg my-4">可看診時間:</h4>
              <div className="overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                />
                {/* <ul>
                {selectedDoctor.availableTimes.map((time, index) => (
                  <li key={index}>{time}</li>
                ))}
              </ul> */}
              </div>
            </div>
          </Modal>
        )}
      </Content>
    </Layout>
  );
};

export default DoctorsPage;
