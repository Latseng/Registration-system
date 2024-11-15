import { Space, Table, Dropdown, Button } from "antd";
import { FaTable, FaEdit } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import PropTypes from  "prop-types"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Column, ColumnGroup } = Table;

const dropdownItems = [
  {
    label: <Button type="text">編輯</Button>,
    key: "0",
  },
  {
    type: "divider",
  },
  {
    label: (
      <Button type="text" danger>
        刪除
      </Button>
    ),
    key: "1",
  },
];

const DepartmentTable = ({category, specialties}) => {
  const [dataSource, setDataSource] = useState(specialties.map((s, index) => (
    {
      key: index,
      specialty: s,
    }
  )))
  const navigate = useNavigate()

  const handleClickEdit = (index) => {
    console.log(index);
  }
  const handleAddSpecailty = () => {
      const newData = {
        key: specialties.length + 1,
       specialty: "新科別",
      };
      setDataSource([...dataSource, newData]);
  }
  const handleDeleteSpecialty = (key) => {
    const newData = dataSource.filter((data) => (
     data.key !== key 
    ))
    setDataSource(newData);
  };
  const handleClickSchedules = (record) => {
    navigate(`/admin/schedules/${record.specialty}`, {
      state: {
        specialty: record.specialty,
      },
    });
  };
  
  return (
    <div className="my-8 bg-white text-center">
      <Table className="my-4" dataSource={dataSource} pagination={false}>
        <ColumnGroup title={category}>
          <Column title="科別名稱" dataIndex="specialty" key="specialty" />
          <Column
            title="門診班表"
            render={(_, record) => (
              <Space size="middle">
                <Button type="text" onClick={() => handleClickSchedules(record)}>
                  <FaTable size={24} />
                </Button>
              </Space>
            )}
          />
          <Column
            title="編輯"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Dropdown
                  menu={{
                    items: dropdownItems,
                    onClick: (items) => {
                      switch (items.key) {
                        case "0":
                          handleClickEdit(record);
                          break;
                        case "1":
                          handleDeleteSpecialty(record.key);
                          break;
                        default:
                          break;
                      }
                    },
                  }}
                  trigger={["click"]}
                >
                  <button onClick={(e) => e.preventDefault()}>
                    <FaEdit size={24} />
                  </button>
                </Dropdown>
              </Space>
            )}
          />
        </ColumnGroup>
      </Table>
      <Button
        className="mb-4 text-gray-400"
        type="text"
        onClick={handleAddSpecailty}
      >
        <IoIosAdd size={24} />
        新增科別
      </Button>
    </div>
  );
}
DepartmentTable.propTypes = {
  category: PropTypes.string,
  specialties: PropTypes.array,
};

export default DepartmentTable