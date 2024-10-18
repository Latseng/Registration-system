

import Sidebar from "../components/Sidebar";
import { Layout } from "antd";

import { useNavigate } from "react-router-dom";


const { Content } = Layout;



const RecordsPage = () => {

  const navigate = useNavigate();
  const handleClickLogo = () => {
     navigate("/*")
  }
   const handleClickPage = (e) => {
     switch (e.key) {
       case "1":
         navigate("/departments");
         break;
       case "2":
         navigate("/query");
         break;
       case "3":
         navigate("/records");
         break;
       case "4":
         navigate("/doctors");
         break;
       default:
         break;
     }
   };

  return (
    <Layout className="min-h-screen">
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />

      <Content className="bg-gray-100 p-6">
        <h1 className="text-2xl mb-6">看診紀錄</h1>
      </Content>
    </Layout>
  );
  
};

export default RecordsPage;
