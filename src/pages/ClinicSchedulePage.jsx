import useRWD from "../hooks/useRWD";
import { useState } from "react";
import Logo from "../components/Logo";
import {
  Layout,
  Menu,
  Button,
  Table,
  Divider,
  Modal,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Sider, Header, Content } = Layout;
// const dummyClinicData = [
//   {
//     id: 1,
//     doctor: "陳ＯＯ",
//     看診日期: "09/14",
//     看診時段: "上午診",
//     掛號人數: 14,
//     額滿: false,
//   },
//   {
//     id: 2,
//     doctor: "黃ＯＯ",
//     看診日期: "09/14",
//     看診時段: "下午診",
//     掛號人數: 14,
//     額滿: false,
//   },
// ];

const ClinicSchedulePage = () => {
  const navigate = useNavigate();
  const device = useRWD();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [form] = Form.useForm();

  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleClickLogo = () => {
    navigate("/*");
  };

  // 生成從今天開始的兩週日期
  const generateDates = () => {
    let dates = [];
    for (let i = 0; i < 14; i++) {
      dates.push(dayjs().add(i, "day").format("MM/DD (ddd)"));
    }
    return dates;
  };

  const dates = generateDates();

  const showModal = (doctorInfo) => {
    setSelectedDoctor(doctorInfo);
    setIsModalVisible(true);
  };
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values: ", values);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 門診時間表的數據
  const dataSource = [
    {
      key: "1",
      time: "上午診",
      ...dates.reduce((acc, date, index) => {
        acc[`date${index}`] = (
          <Button
            type="link"
            onClick={() =>
              showModal({
                department: "內科",
                doctor: "醫師A",
                date,
                timeSlot: "上午診",
              })
            }
          >
            醫師A <br /> 掛號人數: 5
          </Button>
        );
        return acc;
      }, {}),
    },
    {
      key: "2",
      time: "下午診",
      ...dates.reduce((acc, date, index) => {
        acc[`date${index}`] = (
          <Button
            type="link"
            onClick={() =>
              showModal({
                department: "內科",
                doctor: "醫師B",
                date,
                timeSlot: "下午診",
              })
            }
          >
            醫師B <br /> 掛號人數: 3
          </Button>
        );
        return acc;
      }, {}),
    },
    {
      key: "3",
      time: "夜診",
      ...dates.reduce((acc, date, index) => {
        acc[`date${index}`] = (
          <Button
            type="link"
            onClick={() =>
              showModal({
                department: "內科",
                doctor: "醫師C",
                date,
                timeSlot: "夜診",
              })
            }
          >
            醫師C <br /> 掛號人數: 4
          </Button>
        );
        return acc;
      }, {}),
    },
  ];

  // 設定表格的列
  const columns = [
    {
      title: "",
      dataIndex: "time",
      key: "time",
    },
    ...dates.map((date, index) => ({
      title: date,
      dataIndex: `date${index}`,
      key: `date${index}`,
    })),
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
      <Layout className="bg-gray-100 p-6">
        <Content className="bg-white p-6 rounded-md shadow-md">
          <h1 className="text-2xl mb-6">一般內科門診時間表</h1>
          <div className="overflow-x-auto">
            {/* 滑動容器 */}
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
            />
          </div>
        </Content>
      </Layout>

      {/* Modal 彈出框 */}
      <Modal
        title="掛號資訊"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="確認"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="科別"
            name="department"
            initialValue={selectedDoctor?.department}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="醫師"
            name="doctor"
            initialValue={selectedDoctor?.doctor}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="日期"
            name="date"
            initialValue={selectedDoctor?.date}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="門診時段"
            name="timeSlot"
            initialValue={selectedDoctor?.timeSlot}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="身分證字號"
            name="idNumber"
            rules={[{ required: true, message: "請輸入身分證字號" }]}
          >
            <Input placeholder="請輸入身分證字號" />
          </Form.Item>
          <Form.Item
            label="生日"
            name="birthday"
            rules={[{ required: true, message: "請輸入生日" }]}
          >
            <Input placeholder="請輸入生日" />
          </Form.Item>
          <Form.Item
            label="圖形驗證碼"
            name="captcha"
            rules={[{ required: true, message: "請輸入圖形驗證碼" }]}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Input placeholder="請輸入驗證碼" />
              </Col>
              <Col span={8}>
                <Button>刷新驗證碼</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default ClinicSchedulePage;
