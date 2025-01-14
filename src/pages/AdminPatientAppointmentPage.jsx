import { Layout, Table, Button } from "antd";
import { useState, useEffect } from "react";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";
import { getAppointmentsByPatientId } from "../api/patients";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

const AdminPatientPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const isDesktop = useRWD();
  const location = useLocation()
  const { patientId, patientName } = location.state;
  const { CSRF_token } = useSelector((state) => state.auth);
  const [error, setError] = useState(null)

  useEffect(() => {
    const getAppointmentsByPatientIdAsync = async () => {
      setIsLoading
      try {
        const data = await getAppointmentsByPatientId(patientId, CSRF_token);
        if (data === "No appointments found for this patient."){
          setError("使用者沒有掛號資料")
          return
        }
        setAppointments(data.data);
        setIsLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
   getAppointmentsByPatientIdAsync();
  }, [CSRF_token, patientId]);

  const columns = [
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "時段",
      dataIndex: "slot",
      key: "slot",
    },
    {
      title: "科別",
      dataIndex: "specialty",
      key: "specialty",
    },
    {
      title: "醫師",
      dataIndex: "doctor",
      key: "doctor",
    },
    {
      title: "狀態",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "刪除",
      dataIndex: "delete",
      key: "delete",
      render: (_, record) => (
        <Button danger onClick={() => console.log("delete", record.id)}>
          刪除
        </Button>
      ),
    },
  ];

  const dataSource = appointments.map((item) => ({
    key: item.id,
    id: item.id,
    date: dayjs(item.date).format("YYYY-MM-DD"),
    slot: item.scheduleSlot?.includes("Morning") ? "上午診" : "下午診",
    specialty: item.doctorSpecialty,
    doctor: item.doctorName,
    status: item.statue === "CONFIRMED" ? "已掛號" : "已取消",
  }));

  return (
    <Content className="bg-gray-100 p-6">
      <h1 className="text-2xl mb-4">{patientName}：掛號管理</h1>
      {isDesktop && <LoginButton />}
      {error && <span className="text-red-500">{error}</span>}
      <Table dataSource={dataSource} columns={columns} />
      {isLoading && <Table className="mt-12" loading={isLoading} />}
    </Content>
  );
};

export default AdminPatientPage;
