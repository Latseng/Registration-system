import Sidebar from "../components/Sidebar";
import { Layout, Button, Table, Flex } from "antd";
import { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaTable, FaEdit } from "react-icons/fa";
import { getDoctors } from "../api/doctors";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;

const sidebarItems = [
  {
    key: "1",
    label: "科別管理",
  },
  {
    key: "2",
    label: "醫師管理",
  },
  {
    key: "3",
    label: "掛號管理",
  },
];

const columns = [
  {
    title: "門診班表",
    render: (_, record) => (
      <Button type="text" onClick={() => console.log(record)}>
        <FaTable size={24} />
      </Button>
    ),
  },
  {
    title: "姓名",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "科別",
    dataIndex: "department",
  },
  {
    render: (_, record) => (
      <Flex justify="space-around">
        <Button type="text" onClick={() => console.log(record)}>
          <FaEdit size={24} />
        </Button>
        <Button danger onClick={() => console.log(record)}>
          X
        </Button>
      </Flex>
    ),
  },
];

const AdminDoctorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const getDoctorsData = async () => {
      try {
        setIsLoading(true);
        const response = await getDoctors();
        setDoctors(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
   
      getDoctorsData();
    
  }, []);

  const data = doctors.map((d) => ({
    key: d.id,
    id: d.id,
    name: `${d.name}`,
    department: d.specialty,
  }));

  const handleClickPage = (e) => {
    switch (e.key) {
      case "1":
        navigate("/admin/departments");
        break;
      case "2":
        navigate("/admin/doctors");
        break;
      case "3":
        navigate("/admin/appointments");
        break;
      default:
        break;
    }
  };
  const currentPage = () => {
    switch (location.pathname) {
      case "/admin/doctors":
        return "2";
      case "admin/appointments":
        return "3";
      default:
        return "1";
    }
  };

  const handleClick = () => {
    console.log("更多");
  };
  
  return (
    <Layout className="min-h-screen">
      <Sidebar
        items={sidebarItems}
        onClickPage={handleClickPage}
        currentPage={currentPage}
      />
      <Content className="bg-gray-100 p-6">
        <h1 className="text-2xl mb-4">醫師管理</h1>
        <Table loading={isLoading} columns={columns} dataSource={data} />
      </Content>
    </Layout>
  );
};

export default AdminDoctorPage;
