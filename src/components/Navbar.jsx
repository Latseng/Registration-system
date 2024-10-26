import Logo from "./Logo";
import { Layout, Menu, ConfigProvider } from "antd";


const { Header } = Layout

const Navbar = ({onClick , items}) => {
  return (
    <Header className="flex justify-between items-center bg-mainColor px-6">
      <Logo />
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemColor: "white",
            },
          },
        }}
      >
        <Menu className="bg-mainColor text-lg" mode="horizontal" items={items} />
      </ConfigProvider>
      <button className="text-white" onClick={onClick}>
        登入
      </button>
    </Header>
  );
};

export default Navbar;
