import { FaSuitcaseMedical } from "react-icons/fa6";
import { Form, Input, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { loginReqest, adminLoginReqest } from "../api/auth";
import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // const dispatch = useDispatch();
  const [isAdminLoginForm, setIsAdminLoginForm] = useState(false)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    
    if(userData) {
      if (userData?.account) {
      navigate("/admin/departments");
    } else {
      navigate("/departments");
    }}
    

    // const script = document.createElement("script");
    // script.src = "https://accounts.google.com/gsi/client";
    // script.async = true;
    // script.defer = true;
    // document.body.appendChild(script);
    // const div = document.createElement("div");
    // const GOOGLE_CLIENT_ID = "460460481898-kobsunq0hat7a85ml2ejrqhcqjceqtnc.apps.googleusercontent.com"
    // const BASE_URL = "https://registration-system-2gho.onrender.com/"
    // div.id = "g_id_onload";
    // div.setAttribute("data-client_id", GOOGLE_CLIENT_ID);
    // div.setAttribute(
    //   "data-login_uri",
    //   `${BASE_URL}/api/patients/auth/google/callback`
    // );
    // document.body.appendChild(div);
    // return () => {
    //   document.body.removeChild(script);
    //   document.body.removeChild(div);
    // };
  }, []);

  const handlePatientLogin = async (value) => {
    const data = await loginReqest(value);
    if (data.success) {
      const patientData = {
        id: data.user.id,
        name: data.user.name,
        idNumber: data.user.idNumber,
        medicalId: data.user.medicalId,
        birthDate: data.user.birthDate,
        contactInfo: data.user.contactInfo,
        userToken: data.token,
      };
      localStorage.setItem("userData", JSON.stringify(patientData));
      // dispatch(loginState(patientData));
      navigate("/departments");
    }
  };

  const handleAdminLogin = async (value) => {
    const data = await adminLoginReqest(value)
    if(data.success) {
      const adminData = {
        id: data.user.id,
        name: data.user.name,
        account: data.user.account,
        role: data.user.role,
        adminToken: data.token
      };
      localStorage.setItem("userData", JSON.stringify(adminData));
      navigate("/admin/departments");
    }
  }

  const handleSuccess = (response) => {
    console.log("登入成功:", response);
    const token = response.credential;
    console.log(token);
    
    
  };

  const handleError = () => {
    console.error("登入失敗");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {isAdminLoginForm ? (
        <Form
          form={form}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={handleAdminLogin}
          autoComplete="off"
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
            rules={[
              { required: true, message: "請輸入帳號" },
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
          autoComplete="off"
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
            <Input />
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
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
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
