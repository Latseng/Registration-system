import { Layout, Table, Button, Modal } from "antd";
import { useState, useEffect } from "react";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";
import { getPatients, deletePatientById } from "../api/admin";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    const getPatientDataAsync = async () => {
      try {
        const data = await getPatients(CSRF_token);
        setPatients(data.data)
        setIsLoading(false);
      } catch(error) {
        console.log(error);
      }
    }
    getPatientDataAsync();
    
  }, [CSRF_token]);

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
      title: "刪除病患",
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
    setConfirmLoading(true)
    const result = await deletePatientById(selectedPatientId, CSRF_token);
    setConfirmLoading(false);
    console.log(result.status);

  }

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
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleFilled className="mr-4 text-yellow-500 text-3xl" />
            <span>刪除病患資料？</span>
          </div>
        }
        className="p-16"
        open={isConfirmModalOpen}
        onOk={handleOk}
        okType="danger"
        okText="確定"
        confirmLoading={confirmLoading}
        onCancel={() => setIsConfirmModalOpen(false)}
        cancelText="返回"
      >
        <p className="p-4">
          將從資料庫中，刪除該筆病患資料，確定要進行此一操作？
        </p>
      </Modal>
    </Content>
  );
}

export default AdminPatientPage;