import { FaSuitcaseMedical } from "react-icons/fa6";
import { Form, Input, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginState } from "../store/authSlice";
import { loginReqest } from "../api/auth";
import { useEffect } from "react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/departments");
    }
  }, []);

  const handlePatientLogin = async (value) => {
    const data = await loginReqest(value);
    if (data.success) {
      localStorage.setItem("authToken", data.token);
      const patientData = {
        id: data.user.id,
        name: data.user.name,
        idNumber: data.user.idNumber,
        medicalId: data.user.medicalId,
        birthDate: data.user.birthDate,
        contactInfo: data.user.contactInfo,
      };
      dispatch(loginState(patientData));
      navigate("/departments");
    }
  };

  const handleClick = (action) => {
    switch (action) {
      // case "login":
      //   handleLogin()
      //   break;
      case "loginAdmin":
        navigate("/admin/departments");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handlePatientLogin}
        autoComplete="off"
        className="bg-white mb-8 p-12 flex flex-col md:w-1/2 rounded-2xl text-center"
      >
        <button
          onClick={() => navigate("/*")}
          className="mx-auto mb-10 flex items-center text-mainColor text-6xl"
        >
          <FaSuitcaseMedical className="mr-2" />
          <h1>MA</h1>
        </button>
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
        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: "請輸入密碼" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => handleClick("login")}
            className="w-1/2"
            type="primary"
            htmlType="submit"
          >
            登入
          </Button>
        </Form.Item>

        <p className="mb-4">
          還沒有帳號嗎？
          <Link
            to="/register"
            className="text-base mx-2 hover:text-mainColorLight"
          >
            立即註冊
          </Link>
          體驗更加便捷的看診功能！
        </p>

        <Button
          className="w-1/5 mx-auto"
          onClick={() => handleClick("loginAdmin")}
        >
          管理員登入
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
