import MainContent from "../components/MainContent";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/department");
  }
  return (
    <>
     <Navbar />
     <MainContent onClick={handleClick} />
    </>
  );
}

export default MainPage