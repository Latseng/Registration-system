import {
  Button,
  Form,
  Input,
} from "antd";
import DatePicker from "./DatePicker";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const RegisterForm = () => {
  const [form] = Form.useForm();

  const registerFinish = (values) => {
    console.log("Received values of form: ", values);
  };
 
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={registerFinish}
      style={{
        maxWidth: 600,
      }}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="電子信箱"
        rules={[
          {
            type: "email",
            message: "無效電子信箱!",
          },
          {
            required: true,
            message: "請輸入您的電子信箱!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密碼"
        rules={[
          {
            required: true,
            message: "請輸入密碼！",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="密碼確認"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "請再次輸入密碼!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("確認密碼不相符！"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="name"
        label="姓名"
        rules={[
          {
            required: true,
            message: "請輸入姓名",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="birthDate"
        label="生日"
        rules={[{ required: true, message: "請選擇生日" }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          註冊
        </Button>
      </Form.Item>
    </Form>
  );
};
export default RegisterForm;
