import { Layout, Breadcrumb, Button, List } from "antd";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getSchedulesByDoctor } from "../api/schedules";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";

const { Content } = Layout;

const AdminDoctorSchedulesPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { doctorId, doctorName } = location.state;
  const [schedules, setSchedules] = useState([])
  const [isListLoading, setIsListLoading] = useState(false)
  const isDesktop = useRWD()
  
  useEffect(() => {
    setIsListLoading(true)
    const getSchedulesDataAsync = async () => {
      try {
        const data = await getSchedulesByDoctor(doctorId);
        setSchedules(data);
        setIsListLoading(false)
      } catch(error) {
        console.error(error);
      }
    }
     getSchedulesDataAsync();
    
  },[doctorId])

  const ListData = schedules.map(item => {
    const date = new Date(item.date);
    const options = { month: "numeric", day: "numeric" };
    const formattedDate = date.toLocaleString("zh-TW", options);
    const formattedSlot = item.scheduleSlot.includes("Morning") ? "上午診" : "下午診"
    return { date: formattedDate, scheduleSlot: formattedSlot, doctorScheduleId: item.doctorScheduleId };
  })
  
  
  return (
    <Content className="bg-gray-100 p-6">
      {isDesktop && <LoginButton />}
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
        loading={isListLoading}
        dataSource={ListData}
        renderItem={(item) => (
          <List.Item>
            <Button
              onClick={() =>
                navigate(
                  `/admin/doctors/schedules/appointments/${item.doctorScheduleId}`,
                  {
                    state: {
                      appointment: `${item.date}${item.scheduleSlot}`,
                      doctorScheduleId: item.doctorScheduleId,
                      doctorId: doctorId,
                      doctorName: doctorName,
                    },
                  }
                )
              }
            >
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
