import { Layout, Input, Card, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSpecialties } from "../api/specialties";
import LoginButton from "../components/LoginButton";
import useRWD from "../hooks/useRWD";

const { Content } = Layout;
const { Search } = Input;
const gridStyle = {
  width: "25%",
  textAlign: "center",
};

const DepartmentPage = () => {
  const navigate = useNavigate();
  const isDesktop = useRWD()
  const [departments, setDepartments] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();

  const warning = (value) => {
    messageApi.open({
      type: "warning",
      content: value,
    });
  };

  const getSpecialtiesAsnc = async () => {
    try {
      const specialties = await getSpecialties();
      setDepartments(specialties.data.data);
      setIsPageLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (location?.state?.register === "success") {
      messageApi.open({
        type: "success",
        content: "註冊成功",
      });
    }
      if (!searchValue) {
        getSpecialtiesAsnc();
      }
  }, [location?.state?.register, messageApi, searchValue]);
  

  const handleClickSpecialties = (specialty) => {
    navigate("/departments/schedule", { state: { specialty: specialty } });
  };
  const handleSearch = (value, _, { source }) => {
    if (source === "clear") return;
    const filteredData = value.trim();
    if (filteredData.length === 0) return warning("請輸入有效關鍵字");
    const resultData = departments
      .filter((item) => {
        return item.specialties.some((specialty) =>
          specialty.includes(filteredData)
        );
      })
      .map((item) => {
        const newSpecialties = item.specialties.filter((special) =>
          special.includes(filteredData)
        );
        return { ...item, specialties: newSpecialties };
      });

    if (resultData.length === 0) return warning("查無此科別");

    setDepartments(resultData);
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <Content className="bg-gray-100 p-6">
      {isDesktop && <LoginButton />}
      <h1 className="text-2xl mb-4">門診科別</h1>
      {contextHolder}
      <div className="flex mb-4">
        <Search
          placeholder="搜尋科別"
          onSearch={handleSearch}
          onChange={(event) => handleChange(event)}
          allowClear
          style={{
            width: 200,
          }}
        />
      </div>
      {isPageLoading && <Card loading={isPageLoading}></Card>}
      {departments.map((s) => (
        <Card className="my-4" key={s.category} title={s.category}>
          {s.specialties.map((s) => (
            <Card.Grid
              onClick={() => handleClickSpecialties(s)}
              className="flex justify-center text-base cursor-pointer hover:text-mainColorLight"
              key={s}
              style={gridStyle}
            >
              {s}
            </Card.Grid>
          ))}
        </Card>
      ))}
    </Content>
  );
};

export default DepartmentPage;
