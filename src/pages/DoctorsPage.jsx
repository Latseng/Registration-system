import { Layout, List, Table, Input, Avatar } from "antd";
import useRWD from "../hooks/useRWD";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const { Content } = Layout;
const { Search } = Input;

const doctorsData = [
  {
    doctorName: "張OO",
    department: "心臟內科",
    specialties: ["心導管手術", "冠狀動脈疾病"],
  },
  {
    doctorName: "陳OO",
    department: "一般內科",
    specialties: ["高血壓", "糖尿病"],
  },
  {
    doctorName: "李OO",
    department: "神經外科",
    specialties: ["腦腫瘤切除手術", "脊椎外科手術"],
  },
  {
    doctorName: "林OO",
    department: "骨科",
    specialties: ["人工關節置換術", "脊椎疾病"],
  },
  {
    doctorName: "王OO",
    department: "皮膚科",
    specialties: ["皮膚病理學", "皮膚癌診療"],
  },
  {
    doctorName: "周OO",
    department: "小兒科",
    specialties: ["兒童過敏", "兒童氣喘"],
  },
  {
    doctorName: "黃OO",
    department: "婦產科",
    specialties: ["產前檢查", "高危險妊娠"],
  },
  {
    doctorName: "吳OO",
    department: "眼科",
    specialties: ["白內障手術", "視網膜疾病"],
  },
  {
    doctorName: "何OO",
    department: "耳鼻喉科",
    specialties: ["鼻竇炎", "耳聾"],
  },
  {
    doctorName: "劉OO",
    department: "泌尿科",
    specialties: ["前列腺疾病", "膀胱癌"],
  },
  {
    doctorName: "徐OO",
    department: "精神科",
    specialties: ["憂鬱症", "焦慮症", "精神分裂症"],
  },
  {
    doctorName: "邱OO",
    department: "內分泌科",
    specialties: ["甲狀腺疾病", "骨質疏鬆症"],
  },
];

const data = doctorsData.map((d, i) => ({
  href: "https://ant.design",
  title: `${d.doctorName} 醫師`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description: d.department,
  content: `專長： ${d.specialties}`,
}));

const generateDates = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = dayjs().add(i, "day");
    const formattedDate = `${date.format("M/D")}（${"日一二三四五六".charAt(
      date.day()
    )}）`;

    dates.push(formattedDate);
  }
  return dates;
};
const dates = generateDates();

const DoctorsPage = () => {
  const isDesktop = useRWD();
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate("/*");
  };
  const handleClickPage = (e) => {
    switch (e.key) {
      case "1":
        navigate("/departments");
        break;
      case "2":
        navigate("/query");
        break;
      case "3":
        navigate("/records");
        break;
      case "4":
        navigate("/doctors");
        break;
      default:
        break;
    }
  };
  const handleClickLogin = () => {
    navigate("/login");
  };
  const handleSearch = () => {
    console.log("搜尋醫師中");
  };
  return (
    <Layout className="min-h-screen">
      <Sidebar onClickPage={handleClickPage} onClickLogo={handleClickLogo} />
      {isDesktop && (
        <button className="absolute right-8 top-4" onClick={handleClickLogin}>
          登入
        </button>
      )}
      <Content className="bg-gray-100 p-6">
        <h1 className="text-2xl mb-6">醫師資訊</h1>
        <Search
          className="mb-2"
          placeholder="醫師搜尋"
          allowClear
          onSearch={handleSearch}
          style={{
            width: 200,
          }}
        />
        <div className="bg-white py-3">
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                key={item.title}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar shape="square" size={160} src={item.avatar} />
                  }
                  title={
                    <button onClick={() => console.log(event.target)}>
                      <h3>{item.title}</h3>
                    </button>
                  }
                  description={
                    <>
                      <h4 className="text-black my-1">{item.description}</h4>
                      <p className="text-black my-1">{item.content}</p>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default DoctorsPage;
