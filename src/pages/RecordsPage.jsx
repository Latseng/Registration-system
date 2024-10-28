

import Sidebar from "../components/Sidebar";
import { Layout } from "antd";

import { useNavigate } from "react-router-dom";


const { Content } = Layout;

const items = [
  {
    key: "1",
    label: "快速掛號",
  },
  {
    key: "2",
    label: "掛號查詢",
  },
  {
    key: "3",
    label: "看診紀錄",
  },
  {
    key: "4",
    label: "醫師專長查詢",
  },
];

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
   const currentPage = () => {
     switch (location.pathname) {
       case "/query":
         return "2";
       case "/records":
         return "3";
       case "/doctors":
         return "4";
       default:
         return "1";
     }
   };

  return (
    <Layout className="min-h-screen">
      <Sidebar items={items} onClickPage={handleClickPage} onClickLogo={handleClickLogo} currentPage={currentPage} />

      <Content className="bg-gray-100 p-6">
        <h1 className="text-2xl mb-6">看診紀錄</h1>
      </Content>
    </Layout>
  );
  
};

export default RecordsPage;
