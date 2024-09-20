import { Layout } from "antd"
import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;

const DoctorsPage = () => {
  const isDesktop = useRWD();
  const navigate = useNavigate();
  const handleClickLogo = () => {
    navigate("/*");
  };
  const handleClickPage = (e) => {
    switch (e.key) {
      case "1":
        navigate("/departments");
        break;
      case "2":
        navigate("/query");
        break;
      case "3":
        navigate("/records");
        break;
      case "4":
        navigate("/doctors");
        break;
      default:
        break;
    }
  };
  const handleClickLogin = () => {
    navigate("/login");
  };
  return (
    <Layout className="min-h-screen">
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />
      {isDesktop && (
        <button className="absolute right-8 top-4" onClick={handleClickLogin}>
          登入
        </button>
      )}
      <Content className="bg-gray-100 p-6">
        <div>醫師資訊陣列</div>
      </Content>
    </Layout>
  );
}

export default DoctorsPage