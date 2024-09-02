import Logo from "./Logo";
import { Layout } from "antd";

const { Header } = Layout

const Navbar = ({onClick}) => {
  return (
    <Header className="flex justify-between items-center bg-blue-600 px-6">
      <Logo />
      <button className="text-white" onClick={onClick}>登入</button>
    </Header>
  );
};

export default Navbar;
