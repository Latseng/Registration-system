import { Form, Input, Button } from "antd";
import { FaSuitcaseMedical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log("Received values:", values);
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center bg-gray-100">
      <button
        onClick={() => navigate("/*")}
        className="flex text-mainColor text-6xl"
      >
        <FaSuitcaseMedical className="mr-2" />
        <h1>MA</h1>
      </button>
      <Form
        className="bg-white my-8 p-12 flex flex-col md:w-1/2 rounded-2xl text-center"
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <h2 className="text-2xl">會員註冊</h2>
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: "請輸入姓名" }]}
        >
          <Input placeholder="姓名" />
        </Form.Item>

        <Form.Item
          label="電子郵件"
          name="email"
          rules={[
            { required: true, message: "請輸入電子郵件" },
            { type: "email", message: "請輸入有效的電子郵件" },
          ]}
        >
          <Input placeholder="電子郵件" />
        </Form.Item>

        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: "請輸入密碼" }]}
        >
          <Input.Password placeholder="密碼" />
        </Form.Item>

        <Form.Item
          label="確認密碼"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "請再次輸入密碼" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("密碼不一致"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="確認密碼" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            註冊
          </Button>
        </Form.Item>
        <Button onClick={() => navigate("/login")} type="text" block>
          取消
        </Button>
      </Form>
    </div>
  );
};

export default RegisterPage;
