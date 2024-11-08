import { Layout, Divider, ConfigProvider, Menu, Drawer } from "antd"
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useRWD from "../hooks/useRWD";
import Logo from "./Logo";
import { useState, useEffect, useRef } from "react";
import Proptypes from "prop-types"
import { useSelector } from "react-redux";
import { FaCircleUser } from "react-icons/fa6";
import DropdownProfile from "./DropdownProfile";

const {Header, Sider} = Layout

const Sidebar = ({onClickPage, items, currentPage}) => {
  const [openMenu, setOpenMenu] = useState(false)
  const [isDropdownProfileOpen, setIsDropdownProfileOpen] = useState(false)
const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isDesktop = useRWD()
  const user = useSelector((state) => state.auth.user)

useEffect(() => {
  const handleClickProfileOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickProfileOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickProfileOutside);
  };
}, []);


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
              style={{ width: 200 }}
              selectedKeys={[currentPage()]}
              className="bg-mainColor text-center px-6"
              items={items}
              onClick={onClickPage}
            />
          </ConfigProvider>
        </Sider>
      ) : (
        <>
          <Header className="flex justify-between bg-mainColor items-center px-6 relative">
            <button className="text-white" onClick={() => setOpenMenu(true)}>
              <IoMenu className="size-6" />
            </button>
            <Logo onClick={handleClickLogo} />
            {user ? (
              <>
                <button
                  onClick={() => setIsDropdownProfileOpen(true)}
                  className=" text-white  hover:text-gray-300"
                >
                  <FaCircleUser size={28} />
                </button>
                {isDropdownProfileOpen && <DropdownProfile ref={dropdownRef} />}
              </>
            ) : (
              <button className="text-white" onClick={() => navigate("/login")}>
                登入
              </button>
            )}
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
  items: Proptypes.array,
  currentPage: Proptypes.func
};

export default Sidebar