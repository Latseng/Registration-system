
import { Layout, Breadcrumb } from "antd";

import { useLocation, Link } from "react-router-dom";

const { Content } = Layout;



const AdminSchedulePage = () => {
  
  const location = useLocation();
  const { doctorName } = location.state;



  return (
    
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
  );
};

export default AdminSchedulePage;
