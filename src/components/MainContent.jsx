import { Layout, Card, Button } from "antd";
import doctorImage from "@/../public/undraw_doctor_kw5l.png";

const {Content} = Layout

const MainContent = ({onClick}) => {
  return (
    <Content className="p-6 min-h-screen relative">
      <img
        className="w-3/5 absolute -top-2 right-24 -z-10 animate-slideInRight"
        src={doctorImage}
      />
      <div className="absolute top-48  text-4xl left-32 animate-fadeIn">
        <p className="text-mainColor mb-8 font-bold">掛號看診，一鍵搞定</p>
        <Button size="large" className="w-48 h-12 ml-32" type="primary">
          快速掛號
        </Button>
      </div>

      {/* 上方區塊 */}
      {/* <Card
        hoverable
        className="h-40 flex items-center justify-center text-xl"
        onClick={() => onClick("department")}
      >
        快速掛號
      </Card>
      <div className="grid grid-cols-2 gap-4 mt-4"> */}
      {/* 左下區塊 */}
      {/* <Card
          hoverable
          className="h-40 flex items-center justify-center text-xl"
          onClick={() => onClick("query")}
        >
          掛號查詢
        </Card> */}

      {/* 右下區塊 */}
      {/* <Card
          hoverable
          className="h-40 flex items-center justify-center text-xl"
          onClick={() => onClick("records")}
        >
          看診紀錄
        </Card>
      </div> */}
    </Content>
  );
};

export default MainContent;
