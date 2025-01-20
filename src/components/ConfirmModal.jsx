import { Modal, Button } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";


const ConfirmModal = ({ title, description, isOpen, handleOk, isLoading, handleCancel }) => {

  return (
    <Modal
      title={
        <div className="flex items-center">
          <ExclamationCircleFilled className="mr-4 text-yellow-500 text-3xl" />
          <span>{title}</span>
        </div>
      }
      className="p-16"
      open={isOpen}
      onCancel={handleCancel}
      cancelText="返回"
      footer={[
        <Button key="back" onClick={handleCancel}>
          返回
        </Button>,
        <Button key="submit" danger loading={isLoading} onClick={handleOk}>
          確定
        </Button>,
      ]}
    >
      <p className="p-4">{description}</p>
    </Modal>
  );
};

export default ConfirmModal;
