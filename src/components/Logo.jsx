import { FaSuitcaseMedical } from "react-icons/fa6";
import PropTypes from "prop-types";

const Logo = ({onClick}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-white text-2xl"
    >
      <FaSuitcaseMedical className="mr-2" />
      <h1>MA</h1>
    </button>
  );
};
Logo.propTypes = {
  onClick: PropTypes.func,
};
export default Logo;
