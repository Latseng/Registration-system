import { Layout, Card } from "antd";

const {Content} = Layout

const MainContent = ({onClick}) => {
  return (
    <Content className="p-6 bg-gray-100 min-h-screen">
      {/* 上方區塊 */}
      <Card
        hoverable
        className="h-40 flex items-center justify-center text-xl"
        onClick={onClick}
      >
        快速掛號
      </Card>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* 左下區塊 */}
        <Card
          hoverable
          className="h-40 flex items-center justify-center text-xl"
          onClick={() => console.log("預約掛號")}
        >
          掛號查詢
        </Card>

        {/* 右下區塊 */}
        <Card
          hoverable
          className="h-40 flex items-center justify-center text-xl"
          onClick={() => console.log("查詢紀錄")}
        >
          看診紀錄
        </Card>
      </div>
    </Content>
  );
};

export default MainContent;
