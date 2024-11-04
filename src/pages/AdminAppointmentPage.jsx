import Sidebar from "../components/Sidebar";
import { Layout, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "../api/appointments";
import { useEffect, useState } from "react";

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
    title: "姓名",
    dataIndex: "name",
  },
  {
    title: "科別",
    dataIndex: "department",
  },
];


const AdminAppointmentPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppoinetments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    
const getAppointmentsData = async () => {
  setIsLoading(true);
  const response = await getAppointments();
  setAppoinetments(response.data)
  setIsLoading(false);
};
getAppointmentsData()
  }, [])
  // const data = appointments.map((item) => ({
  //   key: item.id,
  //   id: item.id,
  // }));
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
      case "/admin/appointments":
        return "3";
      default:
        return "1";
    }
  };
  return (
    <Layout className="min-h-screen">
      <Sidebar
        items={sidebarItems}
        onClickPage={handleClickPage}
        currentPage={currentPage}
      />
      {/* <Table loading={isLoading} columns={columns} dataSource={data} /> */}
      <Content className="bg-gray-100 p-6"></Content>
    </Layout>
  );
};

export default AdminAppointmentPage;
