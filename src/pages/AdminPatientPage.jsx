import { Layout, Table, Button, message } from "antd";
import { useState, useEffect, useCallback } from "react";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";
import { getPatients, deletePatientById } from "../api/admin";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

const { Content } = Layout;

const AdminPatientPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const isDesktop = useRWD();
  const { CSRF_token } = useSelector(
    (state) => state.auth
  );
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedPatientId,setSelectedPatientId] = useState(null)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()

const getPatientDataAsync = useCallback(async () => {
  try {
    const data = await getPatients(CSRF_token);
    setPatients(data.data);
    setIsLoading(false);
  } catch (error) {
    console.log(error);
  }
},[CSRF_token])

  useEffect(() => {
    setIsLoading(true)
    getPatientDataAsync();
    
  }, [getPatientDataAsync]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "生日",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "聯絡方式",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "掛號",
      dataIndex: "appoinetment",
      key: "appointment",
      render: (_, record) => (
        <Button onClick={() => handleAppointmentsByPatient(record)}>掛號</Button>
      ),
    },
    {
      title: "刪除",
      dataIndex: "delete",
      key: "delete",
      render: (_, record) => (
        <Button danger onClick={() => handleDeleteConfirm(record.id)}>
          刪除
        </Button>
      ),
    },
  ];

  const dataSource = patients.map((item) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    age: dayjs(item.birthDate).format('YYYY-MM-DD'),
    contact: item.email
  }));

  const handleDeleteConfirm = (id) => {
    setIsConfirmModalOpen(true)
    setSelectedPatientId(id);
  }

  const handleOk = async () => {
    setIsConfirmLoading(true);
    const result = await deletePatientById(selectedPatientId, CSRF_token);
    if (result.status === "success") {
      setIsConfirmLoading(false);
      setIsConfirmModalOpen(false);
      setSelectedPatientId(null);
      getPatientDataAsync();
      messageApi.open({
        type: "success",
        content: "刪除成功",
      });
    }
    //刪除失敗
    if (result === "Foreign key constraint failed. Ensure the referenced record exists.") {
      setIsConfirmLoading(false);
      setIsConfirmModalOpen(false);
      setSelectedPatientId(null);
      messageApi.open({
        type: "error",
        content: "刪除失敗，該病患存在掛號資料",
      });
    }
  }

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
    setSelectedPatientId(null);
  };

  const handleAppointmentsByPatient = (record) => {
    navigate(`/admin/patients/appointments/${record.id}`, {
      state: {
        patientId: record.id,
        patientName: record.name,
      },
    });
  };

  return (
    <Content className="bg-gray-100 p-6">
      {contextHolder}
      <h1 className="text-2xl mb-4">病患管理</h1>
      {isDesktop && <LoginButton />}
      <div className="overflow-x-auto bg-white">
        <Table
          loading={isLoading}
          dataSource={dataSource}
          tableLayout="auto"
          columns={columns}
        />
      </div>
      <ConfirmModal
        title={"刪除病患資料"}
        description={"將從資料庫刪除該名病患資料，確定要進行此操作？"}
        isOpen={isConfirmModalOpen}
        handleOk={handleOk}
        isLoading={isConfirmLoading}
        handleCancel={handleCancel}
      />
    </Content>
  );
}

export default AdminPatientPage;