import useRWD from "../hooks/useRWD";
import Logo from "../components/Logo";
import { Layout, Menu, Button, Table, Divider } from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const { Sider, Header, Content } = Layout;

const ClinicSchedulePage = () => {
  const navigate = useNavigate();
  const device = useRWD();

  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickLogo = () => {
    navigate("/*");
  };

  // 定義門診時間表的資料
  const columns = [
    {
      title: "上午診",
      dataIndex: "morning",
      key: "morning",
      render: (text) => <Button>{text}</Button>,
    },
    {
      title: "下午診",
      dataIndex: "afternoon",
      key: "afternoon",
      render: (text) => <Button>{text}</Button>,
    },
    {
      title: "夜診",
      dataIndex: "evening",
      key: "evening",
      render: (text) => <Button>{text}</Button>,
    },
  ];
  const data = [
    {
      key: "1",
      date: "09/01",
      morning: "Dr. A (10)",
      afternoon: "Dr. B (8)",
      evening: "Dr. C (5)",
    },
    {
      key: "2",
      date: "09/02",
      morning: "Dr. D (12)",
      afternoon: "Dr. E (7)",
      evening: "Dr. F (6)",
    },
    // ...更多日期資料
  ];

  return (
    <Layout className="min-h-screen">
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
      <Content className="bg-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl mb-6">一般內科門診時間表</h1>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          title={() => (
            <div className="flex justify-between">
              <span>日期</span>
              <span>診別</span>
            </div>
          )}
        />
      </Content>
    </Layout>
  );
};

export default ClinicSchedulePage;
