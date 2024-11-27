import { Outlet } from "react-router-dom";
import { Layout, Divider, ConfigProvider, Menu, Drawer } from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import Logo from "./Logo";
import { useState } from "react";
import LoginButton from "../components/LoginButton";

const { Header, Sider } = Layout;

const LayoutWithSidebar = () => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const isDesktop = useRWD();

  const generalSidebarProps = {
    items: [
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
    ],
    onClickPage: (e) => {
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
    },
    currentPage: () => {
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
    },
  };

  const adminSidebarProps = {
    items: [
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
    ],
    onClickPage: (e) => {
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
    },
    currentPage: () => {
      switch (location.pathname) {
        case "/admin/doctors":
          return "2";
        case "/admin/appointments":
          return "3";
        default:
          return "1";
      }
    },
  };

  const sidebarProps = location.pathname.includes("/admin")
    ? adminSidebarProps
    : generalSidebarProps;

  const handleClickLogo = () => {
    navigate("/*");
  };

  return (
    <Layout className="min-h-screen">
      {isDesktop ? (
        <Sider
          width={200}
          style={{ backgroundColor: "rgb(81 182 182)" }}
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
                  itemSelectedColor: "#51b6b6",
                  itemHoverColor: "white",
                  itemHoverBg: "#99d9d9",
                },
              },
            }}
          >
            <Menu
              mode="vertical"
              style={{ width: 200 }}
              selectedKeys={[sidebarProps.currentPage()]}
              className="bg-mainColor text-center px-6"
              items={sidebarProps.items}
              onClick={sidebarProps.onClickPage}
            />
          </ConfigProvider>
        </Sider>
      ) : (
        <>
          <Header className="flex justify-between bg-mainColor px-6 relative">
            <button className="text-white" onClick={() => setOpenMenu(true)}>
              <IoMenu className="size-6" />
            </button>
            <Logo onClick={handleClickLogo} />
            <LoginButton />
          </Header>
          <Drawer
            open={openMenu}
            width={200}
            closable={false}
            placement="left"
            onClose={() => setOpenMenu(false)}
          >
            <Menu
              onClick={sidebarProps.onClickPage}
              mode="vertical"
              items={sidebarProps.items}
              selectedKeys={[sidebarProps.currentPage()]}
            />
          </Drawer>
        </>
      )}
      <Outlet />
    </Layout>
  );
};

export default LayoutWithSidebar;
