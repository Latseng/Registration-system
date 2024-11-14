import {
  Layout,
  Button,
  Table,
  Flex,
  Modal,
  Form,
  Input,
  Space,
  message,
  Dropdown
} from "antd";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import {
  getDoctors,
  getDoctorById,
  patchDoctorById,
  deleteDoctorById,
} from "../api/doctors";
import {
  MinusCircleOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { FaCircleUser } from "react-icons/fa6";
import useRWD from "../hooks/useRWD";

const { Content } = Layout;

const dropdownItems = [
  {
    label: <a>個人資訊</a>,
    key: "0",
  },
  {
    type: "divider",
  },
  {
    label: <button>登出</button>,
    key: "1",
  },
];

const AdminDoctorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
    const [isAddNewDoctorModalOpen, setIsAddNewDoctorModalOpen] = useState(false)
  const [doctorInfo, setDoctorInfo] = useState({
    id: null,
    name: "",
    specialty: "",
    description: [],
  });
  const [newDoctorInfo, setNewDoctorInfo] = useState({
    name: "",
    specialty: "",
    description: [{id: uuidv4(), value: ""}],
  });
  const [isDoctorModalLoading, setIsDoctorModalLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [deleteDoctorId, setDeleteDoctorId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const isDesktop = useRWD()

  const [form] = Form.useForm();

  
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "科別",
      dataIndex: "department",
    },
    {
      render: (_, record) => (
        <Flex justify="space-around">
          <Button type="text" onClick={() => handleClick("edit", record.id)}>
            <FaEdit size={24} />
          </Button>
          <Button danger onClick={() => handleClick("delete", record.id)}>
            X
          </Button>
        </Flex>
      ),
    },
  ];

  const handleEditDoctorInfo = async (id) => {
    setIsDoctorModalOpen(true);
    setIsDoctorModalLoading(true);
    const doctor = await getDoctorById(id);
    setDoctorInfo({
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      description: JSON.parse(doctor.description).map((item) => ({
        id: uuidv4(),
        value: item,
      })),
    });
    setIsDoctorModalLoading(false);
  };
  const handleInputChange = (field, value) => {
    setDoctorInfo((prev) => ({ ...prev, [field]: value }));
  };
  const handleDescriptionChange = (index, value) => {
    setDoctorInfo((prev) => {
      const newDescription = [...prev.description];
      newDescription[index].value = value;
      return { ...prev, description: newDescription };
    });
  };
  const addDescriptionField = () => {
    setDoctorInfo((prev) => ({
      ...prev,
      description: [...prev.description, {id: uuidv4(), value: ""}],
    }));
  };
  const removeDescriptionField = (index) => {
    setDoctorInfo((prev) => {
      const newDescription = prev.description.filter((_, idx) => idx !== index);
      return { ...prev, description: newDescription };
    });
  };

  const handleCancel = () => {
    setIsDoctorModalOpen(false);
    setDoctorInfo({
      name: "",
      specialty: "",
      description: [],
    });
  };

  const getDoctorsData = async () => {
    try {
      setIsLoading(true);
      const response = await getDoctors();
      setDoctors(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    setIsSubmitLoading(true);
    const updatedData = {
      ...doctorInfo,
      description: JSON.stringify(
        doctorInfo.description.map((item) => item.value)
      ),
    };
    const result = await patchDoctorById(doctorInfo.id, updatedData);
    if (result === "success") {
      await getDoctorsData();
      setIsDoctorModalOpen(false);
      setIsSubmitLoading(false);
      messageApi.open({
        type: "success",
        content: "資料更新成功",
      });
      return;
    }
    messageApi.open({
      type: "error",
      content: "錯誤！資料更新失敗",
    });
  };

  const handleDelete = async () => {
    console.log(deleteDoctorId);
    
    const result = await deleteDoctorById(deleteDoctorId);
    if (result === "success") {
      await getDoctorsData();
      setIsDeleteConfirmModalOpen(false);
      messageApi.open({
        type: "success",
        content: "資料刪除成功",
      });
      return;
    }
    messageApi.open({
      type: "error",
      content: "錯誤！資料刪除失敗",
    });
  };

  const handleClick = (action, id) => {
    switch (action) {
      case "edit":
        handleEditDoctorInfo(id);
        break;
      case "delete":
        setIsDeleteConfirmModalOpen(true);
        setDeleteDoctorId(id);
        break;
      case "add":
        setIsAddNewDoctorModalOpen(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const data = doctors.map((d) => ({
    key: d.id,
    id: d.id,
    name: `${d.name}`,
    department: d.specialty,
  }));

  
 
  const handleCreateDoctorData = (values) => {
    console.log(values);
    
  }
  const addNewDoctorDescriptionField = () => {
    setNewDoctorInfo((prev) => ({
      ...prev,
      description: [...prev.description, {id: uuidv4(), value: ""}],
    }));
  }

  const handleNewDoctorDescriptionChange = (index, value) => {
    setNewDoctorInfo((prev) => {
      const newDescription = [...prev.description];
      newDescription[index].value = value;
      return { ...prev, description: newDescription };
    });
  }
  const removeNewDoctorDescriptionField = (index) => {
    setNewDoctorInfo((prev) => {
      const newDescription = prev.description.filter((_, idx) => idx !== index);
      return { ...prev, description: newDescription };
    });
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <Content className="bg-gray-100 p-6 relative">
      {contextHolder}
      <h1 className="text-2xl">醫師管理</h1>
      <Button onClick={() => handleClick("add")} className="my-4">
        新增醫師
      </Button>
      {isDesktop && (
        <Dropdown
          menu={{
            items: dropdownItems,
            onClick: (items) => {
              switch (items.key) {
                case "1":
                  handleLogout();
                  break;
                default:
                  break;
              }
            },
          }}
          trigger={["click"]}
        >
          <button
            className="absolute right-8 top-4 text-mainColor rounded-full hover:text-mainColorLight"
            onClick={(e) => e.preventDefault()}
          >
            <FaCircleUser size={28} />
          </button>
        </Dropdown>
      )}
      <Table loading={isLoading} columns={columns} dataSource={data} />
      <Modal
        title="醫師資料編輯"
        open={isDoctorModalOpen}
        loading={isDoctorModalLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={isSubmitLoading}
            onClick={handleSave}
          >
            儲存
          </Button>,
        ]}
      >
        <Form className="p-8">
          <Form.Item label="姓名">
            <Input
              placeholder="請輸入姓名"
              defaultValue={doctorInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="科別">
            <Input
              placeholder="請輸入科別"
              defaultValue={doctorInfo.specialty}
              onChange={(e) => handleInputChange("specialty", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="專長">
            {doctorInfo.description.map((item, index) => (
              <Space
                key={item.id}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Input
                  placeholder="請輸入專長"
                  defaultValue={item.value}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                />
                <Button
                  type="text"
                  danger
                  onClick={() => removeDescriptionField(index)}
                >
                  <MinusCircleOutlined />
                </Button>
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={addDescriptionField}
              icon={<PlusOutlined />}
            >
              新增專長
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="刪除醫師資料"
        open={isDeleteConfirmModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteConfirmModalOpen(false)}
        okType="danger"
        cancelText="返回"
        okText="刪除"
      >
        <div className="flex p-8">
          <ExclamationCircleFilled className="text-yellow-500 text-2xl pr-2" />
          <p>將從資料庫中，刪除該筆醫師資料，確定要進行此一操作？</p>
        </div>
      </Modal>
      <Modal
        title="建立醫師資料"
        open={isAddNewDoctorModalOpen}
        onCancel={() => {
          setIsAddNewDoctorModalOpen(false);
          setNewDoctorInfo({
            name: "",
            specialty: "",
            description: [{ id: uuidv4(), value: "" }],
          });
        }}
        footer={null}
      >
        <Form
          className="p-4"
          form={form}
          layout="vertical"
          onFinish={handleCreateDoctorData}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "請輸入醫師姓名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="科別"
            name="specialty"
            rules={[{ required: true, message: "請輸入醫師科別" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="專長">
            {newDoctorInfo.description.map((item, index) => (
              <Space
                key={item.id}
                style={{ display: "flex", marginBottom: 8 }}
                align="baseline"
              >
                <Input
                  placeholder="請輸入專長"
                  defaultValue={item.value}
                  onChange={(e) =>
                    handleNewDoctorDescriptionChange(index, e.target.value)
                  }
                />
                <Button
                  type="text"
                  danger
                  onClick={() => removeNewDoctorDescriptionField(index)}
                >
                  <MinusCircleOutlined />
                </Button>
              </Space>
            ))}
            <Button
              type="dashed"
              onClick={addNewDoctorDescriptionField}
              icon={<PlusOutlined />}
            >
              新增專長
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
};

export default AdminDoctorPage;
