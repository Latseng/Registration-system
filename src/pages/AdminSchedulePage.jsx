import { Layout, Breadcrumb } from "antd";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ScheduleTable from "../components/ScheduleTable";
import { useEffect } from "react";

const { Content } = Layout;

const AdminSchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { specialty } = location.state;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      if (userData?.idNumber) {
        navigate("/departments");
        return;
      }
      navigate("/admin/departments");
    } else {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <Content className="bg-gray-100 p-6">
      <Breadcrumb
        items={[
          {
            title: <Link to="/admin/departments">科別管理＜</Link>,
          },
        ]}
      />
      <h1 className="text-2xl mb-4">{specialty} 門診班表</h1>
      <ScheduleTable />
    </Content>
  );
};

export default AdminSchedulePage;
