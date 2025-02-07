import { Layout, Input, Card, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import { getSpecialties } from "../api/specialties";
import LoginButton from "../components/LoginButton";
import useRWD from "../hooks/useRWD";
import { useDispatch } from "react-redux";
import { setLogin } from "../store/authSlice";
import { CSRF_request } from "../api/auth";

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
  const dispatch = useDispatch();

  const isCallGoogle = useRef(false);

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

   useEffect(() => {
     //如果第三方登入驗證成功的話，存入登入狀態資料
     const queryString = window.location.search; //第三方登入狀態判斷
     if (queryString.includes("true") && !isCallGoogle.value) {
       const getCSRFtokenAsync = async () => {
         try {
           const result = await CSRF_request();
           const expiresIn = 3600; //設定登入時效為一小時 = 3600秒
           if (result.status === "success") {
             dispatch(
               setLogin({
                 user: {account: "google account"},
                 role: "patient",
                 CSRF_token: result.data.csrfToken,
                 expiresIn: expiresIn,
               })
             );
           } else {
             console.log("CSRF_Token錯誤");
           }
           isCallGoogle.value = true;
         } catch (error) {
           console.error(error);
         }
       };
       getCSRFtokenAsync();
     }
   }, [dispatch]);

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
