import Sidebar from "../components/Sidebar";
import { Layout } from "antd";
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
const AdminAppointmentPage = () => {
  const navigate = useNavigate();
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
      <Content className="bg-gray-100 p-6"></Content>
    </Layout>
  );
};

export default AdminAppointmentPage;
