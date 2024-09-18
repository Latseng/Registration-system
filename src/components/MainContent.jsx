import { Layout, Card } from "antd";

const {Content} = Layout

const MainContent = ({onClick}) => {
  return (
    <Content className="p-6 bg-gray-100 min-h-screen">
      {/* 上方區塊 */}
      <Card
        hoverable
        className="h-40 flex items-center justify-center text-xl"
        onClick={() => onClick("department")}
      >
        快速掛號
      </Card>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* 左下區塊 */}
        <Card
          hoverable
          className="h-40 flex items-center justify-center text-xl"
          onClick={() => onClick("query")}
        >
          掛號查詢
        </Card>

        {/* 右下區塊 */}
        <Card
          hoverable
          className="h-40 flex items-center justify-center text-xl"
          onClick={() => onClick("records")}
        >
          看診紀錄
        </Card>
      </div>
    </Content>
  );
};

export default MainContent;
