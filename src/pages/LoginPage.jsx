import { FaSuitcaseMedical } from "react-icons/fa6";
import { Form, Input, Button } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { login, adminLogin, thirdPartyLogin } from "../api/auth";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../store/authSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isAdminLoginForm, setIsAdminLoginForm] = useState(false);

  useEffect(() => {
    
  }, []);

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

  // 檢查是否有 Google API
  // if (window.google) {
  //   window.google.accounts.id.initialize({
  //     client_id: "460460481898-kobsunq0hat7a85ml2ejrqhcqjceqtnc.apps.googleusercontent.com",
  //     callback: handleCredentialResponse, // 登入成功後的回呼函數
  //   });

  // 渲染 One Tap 按鈕（可選）
  //     window.google.accounts.id.renderButton(
  //       document.getElementById("googleSignInButton"), // 替換為你的按鈕容器
  //       { theme: "outline", size: "large" }
  //     );

  //     // 啟用 One Tap 登入
  //     window.google.accounts.id.prompt();
  //   }
  // }, []);

  // const handleCredentialResponse = async (response) => {
  //   console.log("Google Credential Response:", response);
  //   try {
  //     const res = await fetch(
  //       "https://registration-system-2gho.onrender.com/api/patients/login/google",
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ credential: response.credential }), // 將獲得的憑證發送到後端
  //       }
  //     );
  //     const data = await res.json();
  //     console.log("Login Success:", data);
  //     // 在此處處理登入成功後的邏輯，例如保存 token 或跳轉頁面
  //   } catch (error) {
  //     console.error("Login Failed:", error);
  //   }
  // };

  const handlePatientLogin = async (value) => {
    const data = await login(value);
    console.log(data);

    // if (data.status === "success") {
    //   const patientData = {
    //     id: data.data.user.id,
    //     name: data.data.user.name,
    //     email: data.data.user.email,
    //   };
    //   localStorage.setItem("userData", JSON.stringify(patientData));
    //   // dispatch(loginState(patientData));
    //   navigate("/departments");
    // }
  };

  const handleAdminLogin = async (value) => {
    const data = await adminLogin(value);
    dispatch(setLogin({ user: data.data.user, role: data.data.user.role }));
    navigate("/admin/departments");
  };

  const handleThirdPartyLogin = async (value) => {
    await thirdPartyLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* <div id="googleSignInButton"></div> */}
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
            rules={[{ required: true, message: "請輸入帳號" }]}
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
