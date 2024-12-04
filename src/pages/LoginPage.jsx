import { FaSuitcaseMedical } from "react-icons/fa6";
import { Form, Input, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { login, adminLogin, thirdPartyLogin } from "../api/auth";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../store/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isAdminLoginForm, setIsAdminLoginForm] = useState(false);
  const { isAuthenticated, role } = useSelector((state) => state.auth);
 
  useEffect(() => {
    // 如果已登入
    if (isAuthenticated) {
      // 如果有管理者權限，導向使用者功能頁面
      if (role === "admin") {
        return navigate("/admin/departments");
      }
      return navigate("/departments");
    }
  }, [isAuthenticated, navigate, role]);

  const handlePatientLogin = async (value) => {
    const data = await login(value);
    dispatch(setLogin({ user: data.data.user, role: "patient" }))
    navigate("/departments");
  };

  const handleAdminLogin = async (value) => {
    const data = await adminLogin(value);
    dispatch(setLogin({ user: data.data.user, role: data.data.user.role }));
    navigate("/admin/departments");
  };

  const handleThirdPartyLogin = async () => {
    await thirdPartyLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {isAdminLoginForm ? (
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={handleAdminLogin}
          className="bg-white mb-8 p-16 flex flex-col md:w-1/3 rounded-2xl text-center"
        >
          <button
            onClick={() => navigate("/*")}
            className="mx-auto mb-10 flex items-center text-mainColor text-6xl"
          >
            <FaSuitcaseMedical className="mr-2" />
            <h1>MA</h1>
          </button>
          <Form.Item
            label="帳號"
            name="account"
            rules={[{ required: true, message: "請輸入帳號" }]}
          >
            <Input autoComplete="true" />
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
              className="w-full h-10 mb-4"
              type="primary"
              htmlType="submit"
            >
              登入
            </Button>
          </Form.Item>

          <Button
            className=" mx-auto"
            onClick={() => setIsAdminLoginForm(false)}
          >
            回病患登入
          </Button>
        </Form>
      ) : (
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={handlePatientLogin}
          className="bg-white mb-8 p-12 flex flex-col md:w-1/3 rounded-2xl text-center"
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
            <Input autoComplete="true" />
          </Form.Item>
          <Form.Item
            className="md:ml-10"
            label="密碼"
            name="password"
            rules={[{ required: true, message: "請輸入密碼" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              className="w-full h-10 mb-4"
              type="primary"
              htmlType="submit"
            >
              登入
            </Button>
            <Button onClick={() => handleThirdPartyLogin("google")}>
              Google登入
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
            體驗更多便捷功能！
          </p>
          <Button
            className=" mx-auto"
            onClick={() => setIsAdminLoginForm(true)}
          >
            管理員登入
          </Button>
        </Form>
      )}
    </div>
  );
};

export default LoginPage;
