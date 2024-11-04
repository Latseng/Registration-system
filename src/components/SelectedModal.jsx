import { Modal, Avatar, Card, Form, Flex, Button, Input } from "antd";
import DatePicker from "./DatePicker";
import ReCAPTCHA from "react-google-recaptcha";
import PropTypes from "prop-types";

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
  handleSubmit,
  isFirstCreateAppointment,
  isModalLoading,
  isSubmitLoading,
}) => {
  const [form] = Form.useForm();
   const onChange = (value) => {
     console.log("Captcha value:", value);
   };
  return (
    <Modal
      open={isModalOpen}
      loading={isModalLoading}
      title={isModalLoading && "醫師資訊"}
      onCancel={() => handleCancel("doctor")}
      footer={null}
    >
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
      {selectedAppointment && (
        <Form
          form={form}
          onFinish={handleSubmit}
          labelCol={{ span: 8 }}
          className="w-full max-w-md"
        >
          <h1 className="text-center text-xl font-bold">掛號資訊</h1>
          <div className="my-4 text-center text-lg">
            <h3>一般內科</h3>
            <p>
              {selectedAppointment.date}
              {selectedAppointment.time}
            </p>
            <h3>{selectedAppointment.doctor} 醫師</h3>
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
              <h4>您為初次掛號，請填寫以下資料</h4>
              <Form.Item
                label="姓名"
                name="name"
                rules={[{ required: true, message: "請輸入姓名" }]}
              >
                <Input placeholder="請輸入姓名" />
              </Form.Item>
              <Form.Item
                label="聯絡電話"
                name="number"
                rules={[{ required: true, message: "請輸入聯絡電話" }]}
              >
                <Input placeholder="請輸入聯絡電話" />
              </Form.Item>
            </>
          )}

          <ReCAPTCHA
            className="my-4 ml-20"
            sitekey="Your client site key"
            onChange={onChange}
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
      )}
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
