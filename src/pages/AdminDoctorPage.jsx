import Sidebar from "../components/Sidebar";
import { Layout, Button, Table, Flex, Modal, Form, Input, Space, message } from "antd";
import { useState, useEffect } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaTable, FaEdit } from "react-icons/fa";
import { getDoctors, getDoctorById, patchDoctorById } from "../api/doctors";
import { useNavigate } from "react-router-dom";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Content } = Layout;

const sidebarItems = [
  {
    key: "1",
    label: "科別管理",
  },
  {
    key: "2",
    label: "醫師管理",
  },
  {
    key: "3",
    label: "掛號管理",
  },
];

const AdminDoctorPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState({
    id: null,
    name: "",
    specialty: "",
    description: [],
  });
  const [isDoctorModalLoading, setIsDoctorModalLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const columns = [
    {
      title: "門診班表",
      render: (_, record) => (
        <Button
          type="text"
          onClick={() => navigate(`/admin/schedules/${record.id}`)}
        >
          <FaTable size={24} />
        </Button>
      ),
    },
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
          <Button danger onClick={() => console.log(record)}>
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
      description: JSON.parse(doctor.description),
    });
    setIsDoctorModalLoading(false);
  };
  const handleInputChange = (field, value) => {
    setDoctorInfo((prev) => ({ ...prev, [field]: value }));
  };
  const handleDescriptionChange = (index, value) => {
    setDoctorInfo((prev) => {
      const newDescription = [...prev.description];
      newDescription[index] = value;
      return { ...prev, description: newDescription };
    });
  };
  const addDescriptionField = () => {
    setDoctorInfo((prev) => ({
      ...prev,
      description: [...prev.description, ""],
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
      description: JSON.stringify(doctorInfo.description),
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

  const handleClick = (action, value) => {
    switch (action) {
      case "edit":
        handleEditDoctorInfo(value);
        break;
        case "delete":
        console.log("刪除");
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

  const handleClickPage = (e) => {
    switch (e.key) {
      case "1":
        navigate("/admin/departments");
        break;
      case "2":
        navigate("/admin/doctors");
        break;
      case "3":
        navigate("/admin/appointments");
        break;
      default:
        break;
    }
  };
  const currentPage = () => {
    switch (location.pathname) {
      case "/admin/doctors":
        return "2";
      case "admin/appointments":
        return "3";
      default:
        return "1";
    }
  };

  return (
    <Layout className="min-h-screen">
      {contextHolder}
      <Sidebar
        items={sidebarItems}
        onClickPage={handleClickPage}
        currentPage={currentPage}
      />
      <Content className="bg-gray-100 p-6">
        <h1 className="text-2xl mb-4">醫師管理</h1>
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
                  key={item + index}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Input
                    placeholder="請輸入專長"
                    defaultValue={item}
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
              {/* <Input
                  placeholder="請輸入專長"
                  defaultValue={doctorInfo.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                /> */}
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default AdminDoctorPage;
