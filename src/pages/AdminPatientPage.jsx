import { Layout, Table, Button } from "antd";
import { useState, useEffect } from "react";
import useRWD from "../hooks/useRWD";
import LoginButton from "../components/LoginButton";
import { getPatients } from "../api/patients";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const { Content } = Layout;

const AdminPatientPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const isDesktop = useRWD();
  const { CSRF_token } = useSelector(
    (state) => state.auth
  );

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
    
  }, []);

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
        <Button onClick={() => console.log("掛號", record.id)}>掛號</Button>
      ),
    },
    {
      title: "刪除病患",
      dataIndex: "delete",
      key: "delete",
      render: (_, record) => (
        <Button danger onClick={() => console.log("delete", record.id)}>
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
    </Content>
  );
}

export default AdminPatientPage;