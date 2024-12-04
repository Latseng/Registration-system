import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "antd";
import { logoutReqest } from "../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../store/authSlice";
import useRWD from "../hooks/useRWD";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDesktop = useRWD();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const handleClickLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    const res = await logoutReqest();
    if (res.status === "success") {
      dispatch(setLogout());
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <Dropdown
          menu={{
            items: dropdownItems,
            onClick: (items) => {
              switch (items.key) {
                case "1":
                  handleLogout();
                  break;
                default:
                  break;
              }
            },
          }}
          trigger={["click"]}
        >
          <button
            className={` ${
              isDesktop ? "text-mainColor absolute right-8 top-4" : "text-white"
            } rounded-full hover:text-mainColorLight`}
            onClick={(e) => e.preventDefault()}
          >
            <FaCircleUser size={28} />
          </button>
        </Dropdown>
      ) : (
        <button
          className={isDesktop ? "absolute right-8 top-4 hover:text-mainColor" : "text-white"}
          onClick={handleClickLogin}
        >
          登入
        </button>
      )}
    </>
  );
};

export default LoginButton;
