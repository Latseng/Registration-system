import Sidebar from "../components/Sidebar";
import { Layout, List, Button } from "antd";
import { useState, useEffect } from "react";
import { IoIosMore, IoIosAddCircleOutline } from "react-icons/io";
import { getSpecialties } from "../api/specialties";

const { Content } = Layout;

const items = [
  {
    key: "1",
    label: "門診科別",
  },
  {
    key: "2",
    label: "醫師管理",
  },
  {
    key: "3",
    label: "病患管理",
  },
];

const AdminDepartmentPage = () => {
const [isLoading, setIsLoading] = useState(false)
const [departments, setDepartments] = useState([])

  useEffect(() => {
    const getDepartmentsData = async () => {
      try {
        setIsLoading(true);
        const response = await getSpecialties();
        console.log(response.data.data);
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
  return (
    <Layout className="min-h-screen">
      <Sidebar items={items} />
      <Content className="bg-gray-100 p-6">
        {departments.map((d) => (
          <List key={d.category} className="bg-white pb-4">
            <h3>{d.category}</h3>
            {d.specialties.map((item) => (
              <List.Item key={item}>
                {item}
                <Button type="text">
                  <IoIosMore className="text-xl" />
                </Button>
              </List.Item>
            ))}
          </List>
        ))}
        <List
          className="bg-white pb-4"
          itemLayout="vertical"
          loading={isLoading}
          size="large"
        >
          {!isLoading && (
            <Button type="text">
              <IoIosAddCircleOutline />
            </Button>
          )}
        </List>
      </Content>
    </Layout>
  );

};

export default AdminDepartmentPage;
