import { Layout, Dropdown, Table } from "antd";
import { useState, useEffect } from "react";
import { getSpecialties } from "../api/specialties";
import { useNavigate } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";
import useRWD from "../hooks/useRWD";
import DepartmentTable from "../components/DepartmentTable";

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
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const isDesktop = useRWD();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.reload();
  };

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
    getDepartmentsData();
  }, []);

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
      {departments.map((d, index) => (
        <DepartmentTable
          key={index}
          category={d.category}
          specialties={d.specialties}
        />
      ))}
      {isLoading && <Table loading={isLoading} />}
    </Content>
  );
};

export default AdminDepartmentPage;
