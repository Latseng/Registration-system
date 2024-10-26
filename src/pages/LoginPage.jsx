import { FaSuitcaseMedical } from "react-icons/fa6";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import DatePicker from "../components/DatePicker";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

const handleClick = () => {
navigate("/admin/departments");
}

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <button
        onClick={() => navigate("/*")}
        className="mb-10 flex items-center text-mainColor text-6xl"
      >
        <FaSuitcaseMedical className="mr-2" />
        <h1>MA</h1>
      </button>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="w-full max-w-lg pr-28"
      >
        <Form.Item
          label="身分證字號"
          name="idNumber"
          rules={[
            { required: true, message: "請輸入身分證字號" },
            {
              pattern: /^[A-Z][0-9]{9}$/,
              message: "身份證字號格式錯誤，請輸入正確的身份證字號",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="生日">
          <DatePicker />
        </Form.Item>

        {/* 其他欄位：手機、驗證碼等 */}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button className="w-full" type="primary" htmlType="submit">
            登入
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={handleClick}>管理員登入</Button>
    </div>
  );
};

export default LoginPage;
