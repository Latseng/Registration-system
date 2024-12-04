import { Layout, Breadcrumb } from "antd";
import { useLocation, Link } from "react-router-dom";
import ScheduleTable from "../components/ScheduleTable";

const { Content } = Layout;

const AdminSchedulePage = () => {
  const location = useLocation();
  const { specialty } = location.state;

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
