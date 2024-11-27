import { Layout, Table } from "antd";
import { useState, useEffect } from "react";
import { getSpecialties } from "../api/specialties";
import useRWD from "../hooks/useRWD";
import DepartmentTable from "../components/DepartmentTable";
import LoginButton from "../components/LoginButton";

const { Content } = Layout;

const AdminDepartmentPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const isDesktop = useRWD();

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
    getDepartmentsData();
  }, []);

  return (
    <Content className="bg-gray-100 p-6">
      {isDesktop && <LoginButton />}
      {departments.map((d, index) => (
        <DepartmentTable
          key={index}
          category={d.category}
          specialties={d.specialties}
        />
      ))}
      {isLoading && <Table className="mt-12" loading={isLoading} />}
    </Content>
  );
};

export default AdminDepartmentPage;
