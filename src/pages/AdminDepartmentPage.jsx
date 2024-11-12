
import { Layout, List, Button, Dropdown } from "antd";
import { useState, useEffect } from "react";
import { IoIosMore, IoIosAddCircleOutline } from "react-icons/io";
import { getSpecialties } from "../api/specialties";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import useRWD from "../hooks/useRWD";

const { Content } = Layout;

const dropdownItems = [
  {
    label: <a>個人資訊</a>,
    key: "0",
  },
  {
    type: "divider",
  },
  {
    label: <button>登出</button>,
    key: "1",
  },
];

const AdminDepartmentPage = () => {
const [isLoading, setIsLoading] = useState(false)
const [departments, setDepartments] = useState([])
const navigate = useNavigate()
const isDesktop = useRWD()

const handleLogout = () => {
  localStorage.removeItem("adminData");
  window.location.reload();
};


  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      navigate("/login");
    }
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
  
  return (
    <Content className="bg-gray-100 p-6">
      {isDesktop && (
        <Dropdown
          menu={{
            items: dropdownItems,
            onClick: (items) => {
              switch (items.key) {
                case "1":
                  handleLogout();
                  break;
                default:
                  break;
              }
            },
          }}
          trigger={["click"]}
        >
          <button
            className="absolute right-8 top-4 text-mainColor rounded-full hover:text-mainColorLight"
            onClick={(e) => e.preventDefault()}
          >
            <FaCircleUser size={28} />
          </button>
        </Dropdown>
      )}

      {departments.map((d) => (
        <List
          key={d.category}
          header={<h3 className="text-lg">{d.category}</h3>}
          bordered
          className="bg-white p-4 my-8"
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
        className="bg-white my-8 pb-4 text-center"
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
  );

};

export default AdminDepartmentPage;
