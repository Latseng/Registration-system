import { Layout, Divider, ConfigProvider, Menu, Drawer } from "antd"
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import Logo from "./Logo";
import { useState } from "react";
import Proptypes from "prop-types"

const {Header, Sider} = Layout

const Sidebar = ({onClickPage, items, currentPage}) => {
  const [openMenu, setOpenMenu] = useState(false)
  const navigate = useNavigate();
  const isDesktop = useRWD()

  const handleClickLogo = () => {
    navigate("/*");
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
              className="bg-mainColor text-center px-6"
              items={items}
              onClick={onClickPage}
            />
          </ConfigProvider>
        </Sider>
      ) : (
        <>
          <Header className="flex justify-between bg-mainColor items-center px-6">
            <button className="text-white" onClick={() => setOpenMenu(true)}>
              <IoMenu className="size-6" />
            </button>
            <Logo onClick={handleClickLogo} />
            <button className="text-white">登入</button>
          </Header>
          <Drawer
            open={openMenu}
            width={200}
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

Sidebar.propTypes = {
  onClickPage: Proptypes.func,
  items: Proptypes.object,
  currentPage: Proptypes.func
};

export default Sidebar