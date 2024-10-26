import MainContent from "../components/MainContent";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
 

  const handleClick = (route) => {
    switch (route) {
      case "departments":
        navigate("/departments");
        break;
      case "query":
        navigate("/query");
        break;
      case "doctors":
        navigate("/doctors");
        break;
      case "login":
        navigate("/login");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Navbar handleClick={handleClick} />
      <MainContent handleClick={handleClick} />
    </>
  );
};

export default MainPage;
