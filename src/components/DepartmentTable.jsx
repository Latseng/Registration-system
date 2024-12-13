import { Space, Table, Button } from "antd";
import { FaTable } from "react-icons/fa";
import PropTypes from  "prop-types"
import { useNavigate } from "react-router-dom";

const { Column, ColumnGroup } = Table;


const DepartmentTable = ({category, specialties}) => {
  const dataSource = specialties.map((s, index) => (
    {
      key: index,
      specialty: s,
    }
  ))
  const navigate = useNavigate()

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
        </ColumnGroup>
      </Table>
    </div>
  );
}
DepartmentTable.propTypes = {
  category: PropTypes.string,
  specialties: PropTypes.array,
};

export default DepartmentTable