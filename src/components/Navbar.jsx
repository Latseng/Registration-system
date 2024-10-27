import { Layout, Button, Dropdown, Space } from "antd";
import useRWD from "../hooks/useRWD";
import { IoMenu } from "react-icons/io5";
import { FaSuitcaseMedical } from "react-icons/fa6";


const { Header } = Layout

const Navbar = ({handleClick}) => {
  const isDesktop = useRWD();
  const items = [
    {
      label: (
        <a className="text-mainColorLight" onClick={() => handleClick("query")}>
          掛號查詢
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          className="text-mainColorLight"
          onClick={() => handleClick("doctors")}
        >
          醫師專長查詢
        </a>
      ),
      key: "1",
    },
    {
      label: (
        <a className="text-mainColorLight" onClick={() => handleClick("login")}>
          登入
        </a>
      ),
      key: "2",
    },
  ];
  return (
    <Header className="grid grid-cols-12 gap-1 grid-rows-1   bg-mainColor px-8">
      <div className="flex items-center text-white text-2xl col-start-6 col-end-8 md:col-start-1 md:col-end-3 row-span-1">
        <FaSuitcaseMedical className="mr-2" />
        <h1>MA</h1>
      </div>
      {isDesktop ? (
        <>
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
        </>
      ) : (
        <Dropdown
          className="col-start-12 col-end-13"
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <button className="text-white">
                <IoMenu className="size-8 mt-4" />
              </button>
            </Space>
          </a>
        </Dropdown>
      )}
    </Header>
  );
};

export default Navbar;
