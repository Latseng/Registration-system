import MainContent from "../components/MainContent";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();
  
  const handleClick = (route) => {
    switch (route) {
      case "department":
        navigate("/departments");
        break;
        case "query":
        navigate("/query"); 
         break;
         case "records":
          navigate("/records");
          break;
      default:
        break;
    }
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