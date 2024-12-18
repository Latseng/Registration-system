import { Layout, Button } from "antd";
import doctorImage from "/undraw_doctor_kw5l.png";
import PropTypes from "prop-types";

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
    </Content>
  );
};

MainContent.propTypes = {
  handleClick: PropTypes.func,
};

export default MainContent;
