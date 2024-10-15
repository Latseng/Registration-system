import { Layout, Divider, ConfigProvider, Menu, Drawer } from "antd"
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import Logo from "./Logo";
import { useState } from "react";

const {Header, Sider} = Layout

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


const Sidebar = ({onClickPage, onClickLogo}) => {
  const [openMenu, setOpenMenu] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = useRWD()

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
    <>
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
              onClick={onClickPage}
            />
          </ConfigProvider>
        </Sider>
      ) : (
        <>
          <Header className="flex justify-between items-center bg-blue-600 px-6">
            <button className="text-white" onClick={() => setOpenMenu(true)}>
              <IoMenu className="size-6" />
            </button>
            <Logo onClick={onClickLogo} />
            <button className="text-white">登入</button>
          </Header>
          <Drawer
            open={openMenu}
            closable={false}
            placement="left"
            onClose={() => setOpenMenu(false)}
          >
            <Menu
              onClick={onClickPage}
              mode="vertical"
              items={items}
              defaultSelectedKeys={["1"]}
            />
          </Drawer>
        </>
      )}
    </>
  );
}

export default Sidebar