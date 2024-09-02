import { Layout, Button } from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";

const { Header } = Layout

const Navbar = () => {
  return (
    <Header className="flex justify-between items-center bg-blue-600 px-6">
      <button className="flex items-center text-white text-2xl">
        <FaSuitcaseMedical className="mr-2 text-white" />
        <h1>掛掛</h1>
      </button>
      {/* 登入按鈕 */}
      <Button>登入</Button>
    </Header>
  );
};

export default Navbar;
