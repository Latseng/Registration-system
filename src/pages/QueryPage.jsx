import { Layout, Menu, Button, Divider, Drawer } from "antd";
import Logo from "../components/Logo";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import { useState } from "react";

const { Sider, Header, Content } = Layout;

const QueryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const device = useRWD();
  const [openMenu, setOpenMenu] = useState(false);

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

  return (
    <Layout className="min-h-screen">
      {device === "desktop" ? (
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
            <h1>掛掛</h1>
          </button>
          <Divider className="bg-white w-full" />
          <Menu
            mode="vertical"
            selectedKeys={[currentPage()]}
            className="bg-blue-600 px-6"
            onClick={handleClickPage}
          >
            <Menu.Item key="1" className="custom-menu-item">
              快速掛號
            </Menu.Item>
            <Menu.Item key="2" className="custom-menu-item">
              掛號查詢
            </Menu.Item>
            <Menu.Item key="3" className="custom-menu-item">
              看診紀錄
            </Menu.Item>
          </Menu>
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
            visible={openMenu}
            closable={false}
            placement="left"
            onClose={() => setOpenMenu(false)}
          >
            <Menu mode="vertical" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">快速掛號</Menu.Item>
              <Menu.Item key="2">掛號查詢</Menu.Item>
              <Menu.Item key="3">看診紀錄</Menu.Item>
            </Menu>
          </Drawer>
        </>
      )}

      {/* 右側內容區 */}
      <Content className="bg-gray-100 p-6">
        {device === "desktop" && (
          <button className="absolute right-8 top-4" onClick={handleClickLogin}>
            登入
          </button>
        )}
        <h1 className="text-2xl mb-6">掛號查詢</h1>
      </Content>
    </Layout>
  );
};

export default QueryPage;
