import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { Layout, Button, Input, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpecialties } from "../api/specialties";

const { Content } = Layout;
const {Search} = Input
const gridStyle = {
  width: "25%",
  textAlign: "center",
};

const DepartmentPage = () => {
  const navigate = useNavigate();
  const isDesktop = useRWD();
  const [specialties, setSpecialties] = useState([])
  

  useEffect(() => {
    const getSpecialtiesAsnc = async () => {
      try {
        const specialties = await getSpecialties()
        
        setSpecialties(specialties)
      } catch (error) {
        console.error(error);  
      }
    }
    getSpecialtiesAsnc()
  },[])

  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickLogo = () => {
    navigate("/*");
  };
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

  const handleClickSpecialties = (specialty) => {
    navigate("/departments/schedule", { state: { specialty: specialty } });
  }

  return (
    <Layout className="min-h-screen">
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />
      <Content className="bg-gray-100 p-6">
        {isDesktop && (
          <button className="absolute right-8 top-4" onClick={handleClickLogin}>
            登入
          </button>
        )}
        <h1 className="text-2xl mb-4">門診科別</h1>
        <div className="flex mb-4">
          <Search
            placeholder="搜尋科別"
            allowClear
            style={{
              width: 200,
            }}
          />
        </div>
            {specialties.map((s) => (
              <Card className="my-4" key={s.category} title={s.category}>
                {s.specialties.map((s) => (
                  <Card.Grid key={s} style={gridStyle}>
                    <Button onClick={() => handleClickSpecialties(s)}>{s}</Button>
                  </Card.Grid>
                ))}
              </Card>
            ))} 
      </Content>
    </Layout>
  );
};

export default DepartmentPage;
