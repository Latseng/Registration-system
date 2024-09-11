import MainContent from "../components/MainContent";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/departments");
  }
  const handleClickNav = () =>{
     navigate("/login");
  }
  return (
    <>
     <Navbar onClick={handleClickNav} />
     <MainContent onClick={handleClick} />
    </>
  );
}

export default MainPage