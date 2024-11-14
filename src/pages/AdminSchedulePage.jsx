
import { Layout, Breadcrumb, Table } from "antd";
import dayjs from "dayjs";
import { useLocation, Link } from "react-router-dom";

const { Content } = Layout;

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 14; i++) {
    const date = dayjs("2024-09-01").add(i, "day");
    const formattedDate = `${date.format("M/D")}(${"日一二三四五六".charAt(
      date.day()
    )})`;

    dates.push(formattedDate);
  }
  return dates;
};

const AdminSchedulePage = () => {
  
  const location = useLocation();
  const { doctorName } = location.state;



  return (
    
      <Content className="bg-gray-100 p-6">
        <Breadcrumb
          items={[
            {
              title: <Link to="/admin/departments">科別管理＜</Link>,
            },
          ]}
        />
        <h1 className="text-2xl mb-4">{doctorName} 門診班表</h1>
        <Table />
      </Content>
  );
};

export default AdminSchedulePage;
