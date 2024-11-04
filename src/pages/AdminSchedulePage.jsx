import Sidebar from "../components/Sidebar";
import { Layout, Button, Table, Flex, Breadcrumb } from "antd";
import { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaTable, FaEdit } from "react-icons/fa";
import { getDoctors } from "../api/doctors";
import { useNavigate,useLocation, Link } from "react-router-dom";

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

const AdminSchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorName } = location.state;

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
      return "2";
  }
};
  return (
    <Layout className="min-h-screen">
      <Sidebar
        items={sidebarItems}
        onClickPage={handleClickPage}
        currentPage={currentPage}
      />
      <Content className="bg-gray-100 p-6">
        <Breadcrumb
          items={[
            {
              title: <Link to="/admin/doctors">醫師管理＜</Link>,
            },
          ]}
        />
        <h1 className="text-2xl mb-4">{doctorName} 門診班表</h1>
      </Content>
    </Layout>
  );
};

export default AdminSchedulePage;
