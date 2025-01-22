import { Layout, Table, Breadcrumb, Button, Modal } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getAppointmentsByDoctorScheduleId } from "../api/schedules";
import {
  deleteAppointmentById,
  reCreateAppointment,
  modifyAppointment,
} from "../api/admin";
import { useSelector } from "react-redux";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";
import ConfirmModal from "../components/ConfirmModal";

const { Content } = Layout;

const AdminDoctorAppointmentsPage = () => {
  const location = useLocation();
  const { appointment, doctorScheduleId, doctorId, doctorName } =
    location.state;
  const [appointments, setAppointments] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [confirmModalData, setConfirmModalData] = useState({
    title: "",
    description: "",
    action: "",
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const { CSRF_token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const isDesktop = useRWD();

  const getAppointmentsDataAsync = useCallback(async () => {
    setIsTableLoading(true);
    try {
      const data = await getAppointmentsByDoctorScheduleId(doctorScheduleId);
      setAppointments(data.appointments);
      setIsTableLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [doctorScheduleId]);

  useEffect(() => {
    getAppointmentsDataAsync();
  }, [getAppointmentsDataAsync]);

  const handleAppointment = (appointmentId, action) => {
    setSelectedAppointmentId(appointmentId);
    if (action === "cancel") {
      setConfirmModalData({
        title: "取消掛號確認",
        description: "確定要取消掛號嗎？",
        action: action,
      });
    } else if (action === "reCreate") {
      setConfirmModalData({
        title: "重新掛號確認",
        description: "確定要重新掛號嗎？",
        action: action,
      });
    } else {
      setConfirmModalData({
        title: "刪除掛號確認",
        description: "確定要刪除掛號嗎？",
        action: action,
      });
    }
    setIsConfirmModalOpen(true);
  };

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "候診號碼",
      dataIndex: "consultationNumber",
      key: "age",
    },
    {
      title: "掛號狀態",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "掛號管理",
      dataIndex: "management",
      key: "management",
      render: (_, record) => (
        <div className="flex justify-around">
          {record.status === "已取消" ? (
            <Button
              onClick={() =>
                handleAppointment(record.appointmentId, "reCreate")
              }
            >
              重新掛號
            </Button>
          ) : (
            <Button
              type="text"
              danger
              onClick={() => handleAppointment(record.appointmentId, "cancel")}
            >
              取消掛號
            </Button>
          )}
          <Button
            type="text"
            danger
            onClick={() => handleAppointment(record.appointmentId, "delete")}
          >
            刪除
          </Button>
        </div>
      ),
    },
  ];

  const data = appointments.map((item) => ({
    key: item.id,
    appointmentId: item.id,
    name: item.patient.name,
    consultationNumber: item.consultationNumber,
    status: item.status === "CONFIRMED" ? "已掛號" : "已取消",
  }));

  const handleOk = async () => {
    switch (confirmModalData.action) {
      case "cancel": {
        setIsConfirmLoading(true);
        const result = await modifyAppointment(
          selectedAppointmentId,
          CSRF_token
        );
        if (result.status === "success") {
          setIsConfirmModalOpen(false);
          setIsConfirmLoading(false);
          setConfirmModalData({
            title: "",
            description: "",
            action: "",
          });
          setSelectedAppointmentId(null);
          getAppointmentsDataAsync();
        }
        break;
      }
      case "reCreate": {
        setIsConfirmLoading(true);
        const result = await reCreateAppointment(
          selectedAppointmentId,
          CSRF_token
        );
        if (result.status === "success") {
          setIsConfirmModalOpen(false);
          setIsConfirmLoading(false);
          setConfirmModalData({
            title: "",
            description: "",
            action: "",
          });
          setSelectedAppointmentId(null);
          getAppointmentsDataAsync();
        }
        break;
      }
      case "delete": {
        setIsConfirmLoading(true);
        const result = await deleteAppointmentById(
          selectedAppointmentId,
          CSRF_token
        );
        if (result.status === "success") {
          setIsConfirmModalOpen(false);
          setIsConfirmLoading(false);
          setConfirmModalData({
            title: "",
            description: "",
            action: "",
          });
          setSelectedAppointmentId(null);
          getAppointmentsDataAsync();
        }
        break;
      }
      default:
        break;
    }
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
    setSelectedAppointmentId(null);
    setConfirmModalData({
      title: "",
      description: "",
    });
  };

  return (
    <Content className="bg-gray-100 p-6">
      {isDesktop && <LoginButton />}
      <h1 className="text-2xl mb-8">{appointment}</h1>
      <div>
        <Table loading={isTableLoading} columns={columns} dataSource={data} />
      </div>
      <ConfirmModal
        title={confirmModalData.title}
        description={confirmModalData.description}
        isOpen={isConfirmModalOpen}
        handleOk={handleOk}
        isLoading={isConfirmLoading}
        handleCancel={handleCancel}
      />
    </Content>
  );
};

export default AdminDoctorAppointmentsPage;
