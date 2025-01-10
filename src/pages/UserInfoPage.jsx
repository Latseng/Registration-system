import {
  Form,
  Input,
  Button,
  List,
  Divider,
  message,
  Modal,
  DatePicker,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientById, modifyPatientDataById } from "../api/patients";
import { FaCircleUser } from "react-icons/fa6";
import dayjs from "dayjs";
import { updateUser, setLogout } from "../store/authSlice";
import Navbar from "../components/Navbar";
import { logoutReqest } from "../api/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isAuthenticated, role, user, CSRF_token } = useSelector(
    (state) => state.auth
  );
  const [messageApi, contextHolder] = message.useMessage();
  const [userData, setUserData] = useState({name: "", birthDate: "", contact: ""})
  const [isInfoModalOpen, setIsinfoModalOpen] = useState(false)
  const [isUserDataLoading, setIsUserDataLoading] = useState(true)
  const [isSubmitButtonLoading, setIsSubmitButtonLoading] = useState(false)
  
  const listData = userData ? [
    `姓名： ${userData.name}`,
    `生日： ${userData.birthDate}`,
    `聯絡方式： ${userData.contact}`,
    
  ] : ["姓名：", "生日：", "聯絡方式："];

  const getPatientDataAsync = useCallback(
    async () => {
    try {
      setIsUserDataLoading(true);
      const data = await getPatientById(user.id, CSRF_token);
      const result = {
        name: data.data.name,
        birthDate: dayjs(data.data.birthDate).format("YYYY-MM-DD"),
        contact: data.data.email,
      };
      setUserData(result);
      setIsUserDataLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [CSRF_token, user.id]
  )

  useEffect(() => {
    // 是否登入
    if (isAuthenticated) {
      // 如果為管理者權限，重導至管理者儀表板
      if (role === "admin") {
        return navigate("/admin/departments");
      }
    } else {
      return navigate("/login");
    }
    getPatientDataAsync()
  }, [getPatientDataAsync, isAuthenticated, navigate, role]);

const handleModifiedModalClose = () => {
  setIsinfoModalOpen(false)
  form.resetFields()
}

const handleModifiedDataSubmit = async (value) => {
  setIsSubmitButtonLoading(true)
  const payload = {
    name: value.name,
    birthDate: dayjs(value.birthDate).toISOString(),
    contact: value.email,
  };
  const result = await modifyPatientDataById(user.id, payload, CSRF_token);
  if(result.status === "success") {
    getPatientDataAsync();
     messageApi.open({
       type: "success",
       content: "資料更新成功",
     });
     handleModifiedModalClose();
     const newUserData = {
       id: result.data.id,
       name: result.data.name,
       email: result.data.email,
     };
     //更新全域狀態
    dispatch(
      updateUser(newUserData)
    );
  }
  setIsSubmitButtonLoading(false);
}

 const handleLogout = async () => {
    navigate("/departments");
    const res = await logoutReqest();
    if (res.status === "success") {
      dispatch(setLogout());
    }
  };

  return (
    <>
      <Navbar currentPage={"userPage"} />
      <main className="h-screen bg-gray-100">
        {contextHolder}
        <section className="mx-8 md:mx-20 md:p-8">
          <Divider orientation="left">使用者資訊</Divider>
          <List
            size="large"
            header={<FaCircleUser className="text-mainColor" size={24} />}
            loading={isUserDataLoading}
            footer={
              <Button
                onClick={() => setIsinfoModalOpen(true)}
                className="text-gray-500"
                type="text"
              >
                修改
              </Button>
            }
            bordered
            dataSource={listData}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Modal
            title="修改個人資料"
            open={isInfoModalOpen}
            onCancel={handleModifiedModalClose}
            footer={null}
          >
            <div className="md:mx-10 mt-4">
              <Form
                form={form}
                className="mx-auto my-4 text-center rounded-2xl  bg-white"
                layout="vertical"
                initialValues={{
                  name: userData.name,
                  birthDate: userData.birthDate
                    ? dayjs(userData.birthDate)
                    : null,
                  email: userData.contact,
                }}
                onFinish={handleModifiedDataSubmit}
              >
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[
                    { required: true, message: "請輸入姓名" },
                    { max: 50, message: "不能超過50個字符！" },
                  ]}
                >
                  <Input placeholder="請輸入您的姓名" />
                </Form.Item>
                <Form.Item
                  label="生日"
                  name="birthDate"
                  rules={[
                    {
                      required: true,
                      message: "請選擇生日！",
                    },
                  ]}
                >
                  <DatePicker
                    placement="bottomRight"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item
                  label="電子信箱"
                  name="email"
                  rules={[
                    { required: true, message: "請輸入電子信箱" },
                    { type: "email", message: "請輸入有效電子信箱！" },
                  ]}
                >
                  <Input placeholder="請輸入您的電子信箱" />
                </Form.Item>
                <Form.Item>
                  <div className="my-4 flex gap-4">
                    <Button onClick={handleModifiedModalClose} block>
                      取消
                    </Button>
                    <Button
                      loading={isSubmitButtonLoading}
                      block
                      type="primary"
                      htmlType="submit"
                    >
                      確認
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Modal>
          <div className="m-4 text-center">
            <Button onClick={handleLogout}>登出</Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default LoginPage;
