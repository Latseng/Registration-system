/* eslint-disable no-unused-vars */
import useRWD from "../hooks/useRWD";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";

const handleLogout = () => {
  localStorage.removeItem("userData");
  window.location.reload();
};

const dropdownItems = [
  {
    label: <a>使用者資訊</a>,
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

const LoginButton = () => {
  const isDesktop = useRWD();
  const user = localStorage.getItem("userData");
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate("/login");
  };

  if (!isDesktop) return null;

  return (
    <>
      {user ? (
          <Dropdown
            menu={{
              items: dropdownItems,
              onClick: (items) => {
                switch (items.key){
                  case "1": 
                  handleLogout()
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
      ) : (
        <button
          className="absolute right-8 top-4 hover:text-mainColorLight"
          onClick={handleClickLogin}
        >
          登入
        </button>
      )}
    </>
  );
};

export default LoginButton;
