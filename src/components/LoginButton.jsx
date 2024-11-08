import { useSelector } from "react-redux";
import useRWD from "../hooks/useRWD";
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  const isDesktop = useRWD();
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  const handleClickLogin = () => {
    navigate("/login");
  };

  return (
    <>
      {isDesktop &&
        (user ? (
          <button className="absolute text-mainColor right-8 top-4 hover:text-mainColorLight">
            <FaCircleUser size={28} />
          </button>
        ) : (
          <button
            className="absolute right-8 top-4 hover:text-mainColorLight"
            onClick={handleClickLogin}
          >
            登入
          </button>
        ))}
    </>
  );
};

export default LoginButton;
