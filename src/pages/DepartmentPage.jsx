import useRWD from "../hooks/useRWD";
import Logo from "../components/Logo";
import { Layout, Menu, Button, Divider } from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const { Sider, Header, Content } = Layout;

const DepartmentPage = () => {
  const navigate = useNavigate();
  const device = useRWD()

  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickLogo = () => {
     navigate("/*")
  }
  return (
    <Layout>
      {device === "desktop" ? (
        <Sider
          width={200}
          style={{ backgroundColor: "rgb(37 99 235)" }}
          className="px-6 flex flex-col items-center py-6"
        >
          <button
            onClick={() => navigate("/*")}
            className="mx-auto flex items-center text-white text-3xl"
          >
            <FaSuitcaseMedical className="mr-2" />
            <h1>掛掛</h1>
          </button>
          <Divider className="bg-white w-full" />
          <Menu
            mode="vertical"
            defaultSelectedKeys={["1"]}
            className="bg-blue-600 px-6"
          >
            <Menu.Item key="1">快速掛號</Menu.Item>
            <Menu.Item key="2">掛號查詢</Menu.Item>
            <Menu.Item key="3">看診紀錄</Menu.Item>
          </Menu>
        </Sider>
      ) : (
        /* 手機版導覽列 */
        <Header className="flex justify-between items-center bg-blue-600 px-6">
          <button className="text-white">
            <IoMenu className="size-6" />
          </button>
          <Logo onClick={handleClickLogo} />
          <button className="text-white">登入</button>
        </Header>
      )}

      {/* 右側內容區 */}
      <Content className="bg-gray-100 p-6">
        {device === "desktop" && (
          <button className="absolute right-8 top-4" onClick={handleClickLogin}>
            登入
          </button>
        )}
        <h1 className="text-2xl mb-6">門診科別</h1>
        <div className="flex space-x-4 mb-6">
          <Button>科別搜尋</Button>
          <Button>醫師搜尋</Button>
        </div>
        <div>
          <div className="bg-white mb-6 p-3 rounded-lg">
            <h2 className="text-xl mb-4">內科</h2>
            <div className="flex flex-wrap mb-6">
              <Button className="w-24 h-10 mr-4 mb-2">一般內科</Button>
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
