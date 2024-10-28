import Sidebar from "../components/Sidebar";
import { Layout, List, Button } from "antd";
import { useState, useEffect } from "react";
import { IoIosMore, IoIosAddCircleOutline } from "react-icons/io";
import { getSpecialties } from "../api/specialties";
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


const AdminDepartmentPage = () => {
const [isLoading, setIsLoading] = useState(false)
const [departments, setDepartments] = useState([])
const navigate = useNavigate()

  useEffect(() => {
    const getDepartmentsData = async () => {
      try {
        setIsLoading(true);
        const response = await getSpecialties();
        setDepartments(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getDepartmentsData()
    
  }, []);

  const handleClick = () => {
    console.log("更多")
  }
  
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
  return (
    <Layout className="min-h-screen">
      <Sidebar items={sidebarItems} onClickPage={handleClickPage} currentPage={currentPage}/>
      <Content className="bg-gray-100 p-6">
        {departments.map((d) => (
          <List
            key={d.category}
            header={<h3 className="text-lg">{d.category}</h3>}
            bordered
            className="bg-white p-4 mb-2"
          >
            {d.specialties.map((item) => (
              <List.Item key={item}>
                <span>{item}</span>
                <Button onClick={handleClick} type="text">
                  <IoIosMore className="text-xl" />
                </Button>
              </List.Item>
            ))}
            <List.Item>
              <Button type="text" className="mt-3 mx-auto" size="large">
                <IoIosAddCircleOutline className="text-2xl" />
              </Button>
            </List.Item>
          </List>
        ))}
        <List
          className="bg-white pb-4 text-center"
          bordered
          itemLayout="vertical"
          loading={isLoading}
          size="large"
        >
          {!isLoading && (
            <Button type="text" className="mt-3" size="large">
              <IoIosAddCircleOutline className="text-3xl" />
            </Button>
          )}
        </List>
      </Content>
    </Layout>
  );

};

export default AdminDepartmentPage;
