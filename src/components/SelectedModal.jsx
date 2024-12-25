import { Modal, Avatar, Card, Form, Flex, Button, Input, message } from "antd";
import DatePicker from "./DatePicker";
import ReCAPTCHA from "react-google-recaptcha";
import PropTypes from "prop-types";
import { useState } from "react";
import { createAppointment, createFirstAppointment } from "../api/appointments";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setNewAppointment } from "../store/appointmentSlice";

const gridStyle = {
  width: "25%",
  textAlign: "center",
};

const SelectedModal = ({
  selectedDoctor,
  isModalOpen,
  handleCancel,
  handleAppointment,
  selectedAppointment,
  isFirstCreateAppointment,
  isModalLoading,
  isSubmitLoading,
  setIsSubmitLoading,
  setIsFirstCreateAppointment,
}) => {
  const [form] = Form.useForm();
  const [isAppointmentLoading, setIsAppointmentLoading] = useState(false);
  const { isAuthenticated, role, CSRF_token } = useSelector(
    (state) => state.auth
  );
  const isPatientLogin = isAuthenticated && role === "patient";
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [recaptcha, setRecaptcha] = useState(null);

  const dispatch = useDispatch();

  const handlerecaptchaChange = (value) => {
    setRecaptcha(value);
  };

  const handleSubmit = async (values) => {
    setIsSubmitLoading(true);
    const birthDate = new Date(
      Date.UTC(values.year, values.month - 1, values.day)
    ).toISOString();

    let requestData = {
      idNumber: values.idNumber,
      birthDate: birthDate,
      recaptchaResponse: recaptcha,
      doctorScheduleId: selectedAppointment.id,
    };

    if (isFirstCreateAppointment) {
      requestData = {
        idNumber: values.idNumber,
        birthDate: birthDate,
        recaptchaResponse: recaptcha,
        doctorScheduleId: selectedAppointment.id,
        name: values.name,
      };
      const newFistAppointment = await createFirstAppointment(requestData);
      setIsSubmitLoading(false);
      form.resetFields();
      //新建立掛號狀態
      dispatch(
        setNewAppointment({
          ...newFistAppointment,
          requestData: {
            idNumber: requestData.idNumber,
            birthDate: requestData.birthDate,
            recaptchaResponse: requestData.recaptchaResponse,
          },
        })
      );
      navigate("/query");
      return;
    }

    const newAppointment = await createAppointment(requestData);

    if (newAppointment === "You have already booked this time slot.") {
      messageApi.open({
        type: "warning",
        content: "重複掛號",
      });
      setIsSubmitLoading(false);
      return;
    }
    if (typeof newAppointment === "string" && newAppointment.includes("初診")) {
      setIsSubmitLoading(false);
      setIsFirstCreateAppointment(true);
      messageApi.open({
        type: "warning",
        content: "您為初次掛號，請填寫以下資料",
      });
      return;
    }
    form.resetFields();
    //新建立掛號狀態
    dispatch(
      setNewAppointment({
        ...newAppointment,
        requestData: {
          idNumber: requestData.idNumber,
          birthDate: requestData.birthDate,
          recaptchaResponse: requestData.recaptchaResponse,
        },
      })
    );
    navigate("/query");
  };

  //使用者登入後的掛號
  const handleAppointmentLogin = async () => {
    setIsAppointmentLoading(true);
    const requestData = {
      recaptchaResponse: recaptcha,
      doctorScheduleId: selectedAppointment.id,
      isAuthenticated,
      CSRF_token,
    };

    const newAppointment = await createAppointment(requestData);

    if (newAppointment === "You have already booked this time slot.") {
      messageApi.open({
        type: "warning",
        content: "重複掛號",
      });
      setIsAppointmentLoading(false);
      return;
    }
    form.resetFields();

    navigate("/query");
  };
  return (
    <Modal
      open={isModalOpen}
      loading={isModalLoading}
      title={isModalLoading && "醫師資訊"}
      onCancel={() => handleCancel("doctor")}
      footer={null}
    >
      {contextHolder}
      {selectedDoctor && (
        <div className="p-4">
          <h3 className="text-2xl">{selectedDoctor.name} 醫師</h3>
          <Avatar
            shape="square"
            size={100}
            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${selectedDoctor.id}`}
            alt={`${selectedDoctor.name}照片`}
            style={{ width: "100px", marginBottom: "10px" }}
          />
          <div className="my-4 text-base">
            <p>科別： {selectedDoctor.specialty}</p>
            <p>專長：{JSON.parse(selectedDoctor.description).join("、")}</p>
          </div>
          <Card className="my-4" title="可掛號時段">
            {selectedDoctor.schedules.map((schedule) => (
              <Card.Grid
                className="cursor-pointer hover:text-blue-500"
                onClick={() =>
                  handleAppointment({
                    date: schedule.date,
                    doctor: selectedDoctor.name,
                    time: schedule.scheduleSlot,
                    id: schedule.id,
                  })
                }
                key={schedule.id}
                style={gridStyle}
              >
                <p>{schedule.date}</p>
                <p>{schedule.scheduleSlot}</p>
                <p>已掛號{schedule.bookedAppointments}人</p>
              </Card.Grid>
            ))}
          </Card>
        </div>
      )}
      {selectedAppointment &&
        (isPatientLogin ? (
          <div className="text-center">
            <h1 className="text-xl font-bold">掛號資訊</h1>
            <div className="my-4 text-base">
              <p>
                {selectedAppointment.date}
                {selectedAppointment.time}
              </p>
              <p>{selectedAppointment.specialty}</p>
              <p>{selectedAppointment.doctor} 醫師</p>
            </div>
            <p className="my-4">將幫您預約以上門診，確定要掛號嗎？</p>
            <Button
              loading={isAppointmentLoading}
              onClick={handleAppointmentLogin}
              className="w-1/2"
              type="primary"
            >
              確定
            </Button>
          </div>
        ) : (
          <Form
            form={form}
            onFinish={handleSubmit}
            labelCol={{ span: 8 }}
            className="w-full max-w-md"
          >
            <h1 className="text-center text-xl font-bold">掛號資訊</h1>
            <div className="my-4 text-center text-lg">
              <p>{selectedAppointment.specialty}</p>
              <p>
                {selectedAppointment.date}
                {selectedAppointment.time}
              </p>
              <p>{selectedAppointment.doctor} 醫師</p>
            </div>
            <Form.Item
              label="身分證字號"
              name="idNumber"
              rules={[{ required: true, message: "請輸入身分證字號" }]}
            >
              <Input placeholder="請輸入身分證字號" />
            </Form.Item>
            <Form.Item label="生日" name="birthday">
              <DatePicker form={form} />
            </Form.Item>
            {isFirstCreateAppointment && (
              <>
                <h4 className="m-4 text-center text-base text-red-500">
                  您為初次掛號，請填寫以下資料
                </h4>
                <Form.Item
                  label="姓名"
                  name="name"
                  rules={[{ required: true, message: "請輸入姓名" }]}
                >
                  <Input placeholder="請輸入姓名" />
                </Form.Item>
              </>
            )}

            <ReCAPTCHA
              className="my-4 ml-20"
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handlerecaptchaChange}
            />
            <Form.Item>
              <Flex gap="middle" justify="center">
                <Button onClick={handleCancel}>取消</Button>

                <Button
                  type="primary"
                  loading={isSubmitLoading}
                  htmlType="submit"
                >
                  送出
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        ))}
    </Modal>
  );
};
SelectedModal.propTypes = {
  selectedDoctor: PropTypes.object,
  isModalOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
  handleAppointment: PropTypes.func,
  selectedAppointment: PropTypes.object,
  handleSubmit: PropTypes.func,
  isFirstCreateAppointment: PropTypes.bool,
  isModalLoading: PropTypes.bool,
  isSubmitLoading: PropTypes.bool,
};

export default SelectedModal;
