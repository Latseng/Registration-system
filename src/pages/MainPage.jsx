import MainContent from "../components/MainContent";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import{ Button } from "antd"


const MainPage = () => {
  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      label: "掛號查詢"
    },
    {
      key: "2",
      label: "醫師專長查詢"
    }
  ]
  
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
      <Navbar onClick={handleClickNav} items={items} />
      <MainContent />
    </>
  );
}

export default MainPage