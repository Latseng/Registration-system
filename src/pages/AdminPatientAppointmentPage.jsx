import { Layout, Table, Button, message } from "antd";
import { useState, useEffect, useCallback } from "react";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";
import { getAppointmentsByPatientId, deleteAppointmentById } from "../api/admin";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const { Content } = Layout;

const AdminPatientPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const isDesktop = useRWD();
  const location = useLocation()
  const { patientId, patientName } = location.state;
  const { CSRF_token } = useSelector((state) => state.auth);
  const [error, setError] = useState(null)
  const[isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const[isConfirmLoading, setIsConfirmLoading] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  const [messageApi, contextHolder] = message.useMessage();

const getAppointmentsByPatientIdAsync = useCallback(
  async () => {
  setIsLoading(true);
  try {
    const data = await getAppointmentsByPatientId(patientId, CSRF_token);
    if (data === "No appointments found for this patient.") {
      setError("使用者沒有掛號資料");
      setIsLoading(false);
      return;
    }
    setAppointments(data.data);
    setIsLoading(false);
  } catch (error) {
    console.log(error);
  }
},[CSRF_token, patientId])

  useEffect(() => {
   getAppointmentsByPatientIdAsync();
  }, [getAppointmentsByPatientIdAsync]);

  const handleDelete = (id) => {
    setSelectedAppointmentId(id);
    setIsConfirmModalOpen(true)
  }
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
        <Button danger onClick={() => handleDelete(record.id)}>
          刪除
        </Button>
      ),
    },
  ];

  const dataSource = appointments.map((item) => ({
    key: item.appointmentId,
    id: item.appointmentId,
    date: dayjs(item.date).format("YYYY-MM-DD"),
    slot: item.scheduleSlot?.includes("Morning") ? "上午診" : "下午診",
    specialty: item.doctorSpecialty,
    doctor: item.doctorName,
    status: item.statue === "CONFIRMED" ? "已掛號" : "已取消",
  }));

  const handleOk = async () => {
    setIsConfirmLoading(true);
    const result = await deleteAppointmentById(selectedAppointmentId, CSRF_token);
    if(result.status === "success"){
       setIsConfirmLoading(false);
       setIsConfirmModalOpen(false);
       setSelectedAppointmentId(null);
       getAppointmentsByPatientIdAsync();
       messageApi.open({
         type: "success",
         content: "刪除成功",
       });
    }
  }
  const handleCancel = () => {
    setIsConfirmModalOpen(false);
    setSelectedAppointmentId(null);
  }
  return (
    <Content className="bg-gray-100 p-6">
      {contextHolder}
      <h1 className="text-2xl mb-4">{patientName}：掛號管理</h1>
      {isDesktop && <LoginButton />}
      {error && <span className="text-red-500 text-lg">{error}</span>}
      <Table loading={isLoading} dataSource={dataSource} columns={columns} />
      <ConfirmModal
        title={"刪除病患掛號"}
        description={"將從資料庫刪除病患掛號資料，確定要進行此操作？"}
        isOpen={isConfirmModalOpen}
        handleOk={handleOk}
        isLoading={isConfirmLoading}
        handleCancel={handleCancel}
      />
    </Content>
  );
};

export default AdminPatientPage;
