import { Layout, Breadcrumb, Button, List } from "antd";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { getSchedulesByDoctor } from "../api/schedules";

const { Content } = Layout;

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

const AdminDoctorSchedulesPage = () => {
  const location = useLocation()
  const { doctorId, doctorName } = location.state;
  const [schedules, setSchedules] = useState([])
  
  useEffect(() => {
    const getSchedulesDataAsync = async () => {
      try {
        const data = await getSchedulesByDoctor(doctorId);
        setSchedules(data);
      } catch(error) {
        console.error(error);
      }
    }
     getSchedulesDataAsync();
    
  },[])
 
console.log(schedules);


  const renderData = schedules.map(item => {
    const date = new Date(item.date);
    const options = { month: "numeric", day: "numeric" };
    const formattedDate = date.toLocaleString("zh-TW", options);
    const formattedSlot = item.scheduleSlot.includes("Morning") ? "上午診" : "下午診"
    return { date: formattedDate, scheduleSlot: formattedSlot, doctorScheduleId: item.doctorScheduleId };
  })
  
  
  return (
    <Content className="bg-gray-100 p-6">
      <Breadcrumb
        items={[
          {
            title: <Link to="/admin/doctors">醫師管理＜</Link>,
          },
        ]}
      />
      <h1 className="text-2xl mb-8">{doctorName}醫師 門診</h1>
      <List
        size="large"
        className="flex justify-center bg-white"
        bordered
        dataSource={renderData}
        renderItem={(item) => (
          <List.Item>
            <Button onClick={() => console.log(item)
            }>
              <span className="mx-2">{item.date}</span>
              <span className="mx-2">{item.scheduleSlot}</span>
            </Button>
          </List.Item>
        )}
      />
    </Content>
  );
};

export default AdminDoctorSchedulesPage;
