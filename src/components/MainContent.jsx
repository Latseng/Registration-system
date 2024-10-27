import { Layout, Button } from "antd";
import doctorImage from "@/../public/undraw_doctor_kw5l.png";

const {Content} = Layout

const MainContent = ({handleClick}) => {
  return (
    <Content className="w-screen p-6 md:relative">
      <div className="md:bg-contain md:w-3/5 md:absolute md:-top-2 md:right-16 md:-z-10 animate-slideInRight">
        <img src={doctorImage} />
      </div>
      <div className="text-center mt-8 text-2xl md:absolute md:top-48 md:text-4xl md:left-24 animate-fadeIn">
        <p className="text-mainColor mb-8 font-bold animate-slideInLeft">
          掛號看診，一鍵搞定
        </p>
        <Button
          size="large" 
          onClick={() => handleClick("departments")}
          className="w-48 h-12 md:ml-20 animate-slideInRight"
          type="primary"
        >
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
