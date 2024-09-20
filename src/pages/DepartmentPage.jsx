import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
const { Content } = Layout;

const DepartmentPage = () => {
  const navigate = useNavigate();
  const isDesktop = useRWD();

  const handleClickLogin = () => {
    navigate("/login");
  };
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

  return (
    <Layout className="min-h-screen">
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />
      <Content className="bg-gray-100 p-6">
        {isDesktop && (
          <button className="absolute right-8 top-4" onClick={handleClickLogin}>
            登入
          </button>
        )}
        <h1 className="text-2xl mb-6">門診科別</h1>
        <div className="flex space-x-4 mb-6">
          <Button>科別搜尋</Button>
        </div>
        <div>
          <div className="bg-white mb-6 p-3 rounded-lg">
            <h2 className="text-xl mb-4">內科</h2>
            <div className="flex flex-wrap mb-6">
              <Button
                className="w-24 h-10 mr-4 mb-2"
                onClick={() => {
                  navigate("/departments/schedule");
                }}
              >
                一般內科
              </Button>
              <Button className="w-24 h-10 mr-4 mb-2">心臟內科</Button>
              <Button className="w-24 h-10 mr-4 mb-2">肝膽腸胃科</Button>
              <Button className="w-24 h-10 mr-4 mb-2">腎臟科</Button>
            </div>
          </div>

          <div className="bg-white mb-6 p-3 rounded-lg">
            <h2 className="text-xl mb-4">外科</h2>
            <div className="flex flex-wrap mb-6">
              <Button className="w-24 h-10 mr-4 mb-2">一般外科</Button>
              <Button className="w-24 h-10 mr-4 mb-2">骨科</Button>
            </div>
          </div>
          <div className="bg-white mb-6 p-3 rounded-lg">
            <h2 className="text-xl mb-4">其他</h2>
            <div className="flex flex-wrap mb-6">
              <Button className="w-24 h-10 mr-4 mb-2">中醫</Button>
              <Button className="w-24 h-10 mr-4 mb-2">眼科</Button>
              <Button className="w-24 h-10 mr-4 mb-2">皮膚科</Button>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default DepartmentPage;
