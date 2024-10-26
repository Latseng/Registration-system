import { Layout, Divider, ConfigProvider, Menu, Drawer } from "antd"
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import Logo from "./Logo";
import { useState } from "react";

const {Header, Sider} = Layout

const Sidebar = ({onClickPage, onClickLogo, items}) => {
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
              style={{width: 200}}
              selectedKeys={[currentPage()]}
              className="bg-mainColor px-6"
              items={items}
              onClick={onClickPage}
            />
          </ConfigProvider>
        </Sider>
      ) : (
        <>
          <Header className="flex justify-between bg-mainColor items-centerpx-6">
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
              selectedKeys={[currentPage()]}
            />
          </Drawer>
        </>
      )}
    </>
  );
}

export default Sidebar