import { Layout, Table, Breadcrumb, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getAppointmentsByDoctorScheduleId } from "../api/schedules";
import { cancelAppointment, reCreateAppointment, deleteAppointment } from "../api/appointments";
import { useSelector } from "react-redux";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";

const { Content } = Layout;

const AdminDoctorAppointmentsPage = () => {
  const location = useLocation();
  const { appointment, doctorScheduleId, doctorId, doctorName } = location.state;
  const [appointments, setAppointments] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    appointmentId: null,
    action: "",
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
   const { CSRF_token } = useSelector(
     (state) => state.auth
   );
   const navigate = useNavigate()
   const isDesktop = useRWD()
  useEffect(() => {
    setIsTableLoading(true);
    const getAppointmentsDataAsync = async () => {
      try {
        const data = await getAppointmentsByDoctorScheduleId(doctorScheduleId);
        setAppointments(data.appointments);
        setIsTableLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getAppointmentsDataAsync();
  }, []);

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
                setConfirmModal({
                  appointmentId: record.appointmentId,
                  isOpen: true,
                  action: "re-appointment",
                })
              }
            >
              重新掛號
            </Button>
          ) : (
            <Button
              type="text"
              danger
              onClick={() =>
                setConfirmModal({
                  appointmentId: record.appointmentId,
                  isOpen: true,
                  action: "cancel",
                })
              }
            >
              取消掛號
            </Button>
          )}
          <Button
            type="text"
            danger
            onClick={() =>
              setConfirmModal({
                appointmentId: record.appointmentId,
                isOpen: true,
                action: "delete",
              })
            }
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

  //確認Modal資料送出
  const handleOk = async () => {
    setConfirmLoading(true);
    if (confirmModal.action === "cancel") {
      const result = await cancelAppointment(
        confirmModal.appointmentId,
        CSRF_token
      );
      if (result.data.status === "success") {
        setConfirmModal({
          appointmentId: null,
          isOpen: false,
          action: "",
        });
        setAppointments(
          appointments.map((item) => {
            if (item.id === confirmModal.appointmentId) {
              return { ...item, status: "CANCELED" };
            }
            return item;
          })
        );
      }
      setConfirmLoading(false);
    } else if (confirmModal.action === "delete") {
      const result = await deleteAppointment(
        confirmModal.appointmentId,
        CSRF_token
      );
      if (result.data.status === "success") {
        setConfirmModal({
          appointmentId: null,
          isOpen: false,
          action: "",
        });
        setAppointments(
          appointments.filter((item) => (
            item.id !== confirmModal.appointmentId
          ))
        );
      }
      setConfirmLoading(false);

    } else {
      const result = await reCreateAppointment(
        confirmModal.appointmentId,
        CSRF_token
      );
      if (result.data.status === "success") {
        setConfirmModal({
          appointmentId: null,
          isOpen: false,
          action: "",
        });
        setAppointments(
          appointments.map((item) => {
            if (item.id === confirmModal.appointmentId) {
              return { ...item, status: "CONFIRMED" };
            }
            return item;
          })
        );
      }
    setConfirmLoading(false);
    }
  };

  return (
    <Content className="bg-gray-100 p-6">
      {isDesktop && <LoginButton />}
      <h1 className="text-2xl mb-8">{appointment}</h1>
      <div>
        <Table loading={isTableLoading} columns={columns} dataSource={data} />
      </div>
      {/* 取消掛號確認 */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleFilled className="mr-4 text-yellow-500 text-3xl" />
            <span>確定要進行此操作？</span>
          </div>
        }
        className="p-16"
        open={confirmModal.isOpen}
        onOk={handleOk}
        okType="danger"
        okText="確定"
        confirmLoading={confirmLoading}
        onCancel={() =>
          setConfirmModal({
            appointmentId: null,
            isOpen: false,
            action: "",
          })
        }
        cancelText="返回"
      >
        <p className="p-4">
          您將要執行
          {confirmModal.action === "cancel"
            ? "取消"
            : confirmModal.action === "delete"
            ? "刪除"
            : "重新"}
          掛號的操作
        </p>
      </Modal>
    </Content>
  );
};

export default AdminDoctorAppointmentsPage;
