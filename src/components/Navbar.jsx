import Logo from "./Logo";
import { Layout, Button } from "antd";


const { Header } = Layout

const Navbar = ({handleClick}) => {
  return (
    <Header className="grid grid-cols-12 gap-4 grid-rows-1   bg-mainColor px-8">
      <Logo className="col-start-1 col-end-5 row-span-1" />
      <Button
        className="my-auto col-start-8 col-end-10 row-span-1"
        type="primary"
        size="large"
        onClick={() => handleClick("query")}
      >
        掛號查詢
      </Button>
      <Button
        className="my-auto col-start-10 col-end-12 row-span-1"
        type="primary"
        size="large"
        onClick={() => handleClick("doctors")}
      >
        醫師專長查詢
      </Button>
      <Button
        className="my-auto col-start-12 col-end-13 row-span-1"
        type="primary"
        onClick={() => handleClick("login")}
      >
        登入
      </Button>
    </Header>
  );
};

export default Navbar;
