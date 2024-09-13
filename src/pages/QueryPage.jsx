import { Layout, Menu, ConfigProvider, Button, Divider, Drawer } from "antd";
import Logo from "../components/Logo";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import { useState, useEffect } from "react";
import { getAppointment, deleteAppointment } from "../api/appointment";

const { Sider, Header, Content } = Layout;
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
];

const QueryPage = () => {
  const location = useLocation();
  
  const navigate = useNavigate();
  const isDesktop = useRWD();
  const [openMenu, setOpenMenu] = useState(false);
  const [appointment, setAppointment] = useState(null)
  
  

  useEffect(() => {
    const getAppointmentData = async () => {
      try {
       const response = await getAppointment();
       setAppointment(response[0])
      } catch (error) {
        console.error(error);
      }
    }
    getAppointmentData()
  }, []);

  const currentPage = () => {
    switch (location.pathname) {
      case "/query":
        return "2";
      case "/records":
        return "3";
      default:
        return "1";
    }
  };
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
      default:
        break;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id)
      setAppointment(null)
    } catch(error) {
      console.error(error);
    }
  }

  return (
    <Layout className="min-h-screen">
      {isDesktop ? (
        <Sider
          width={200}
          style={{ backgroundColor: "rgb(37 99 235)" }}
          className="px-6 flex flex-col items-center py-6"
        >
          <button
            onClick={() => navigate("/*")}
            className="mx-auto flex items-center text-white text-3xl"
          >
            <FaSuitcaseMedical className="mr-2" />
            <h1>MA</h1>
          </button>
          <Divider className="bg-white w-full" />
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemColor: "white",
                  itemSelectedColor: "rgb(59 130 246)",
                },
              },
            }}
          >
            <Menu
              mode="vertical"
              selectedKeys={[currentPage()]}
              className="bg-blue-600 px-6"
              items={items}
              onClick={handleClickPage}
            />
          </ConfigProvider>
        </Sider>
      ) : (
        /* 手機版導覽列 */
        <>
          <Header className="flex justify-between items-center bg-blue-600 px-6">
            <button className="text-white" onClick={() => setOpenMenu(true)}>
              <IoMenu className="size-6" />
            </button>
            <Logo onClick={handleClickLogo} />
            <button className="text-white">登入</button>
          </Header>
          <Drawer
            open={openMenu}
            closable={false}
            placement="left"
            onClose={() => setOpenMenu(false)}
          >
            <Menu mode="vertical" items={items} defaultSelectedKeys={["1"]} />
          </Drawer>
        </>
      )}

      {/* 右側內容區 */}
      <Content className="bg-gray-100 p-6">
        {isDesktop === "desktop" && (
          <button className="absolute right-8 top-4" onClick={handleClickLogin}>
            登入
          </button>
        )}
        {appointment ? (
          <>
            <h1 className="text-2xl mb-6">您的看診時段</h1>
            <div className="mb-10">
              <h3>日期：{appointment.date}</h3>
              <h3>時段：{appointment.time}</h3>
              <h3>看診醫師：{appointment.doctor}</h3>
            </div>
            <Button onClick={() => handleDelete(appointment.id)} danger>取消掛號</Button>
          </>
        ) : (
          <h1 className="text-2xl mb-6">您目前沒有看診掛號</h1>
        )}
      </Content>
    </Layout>
  );
};

export default QueryPage;
