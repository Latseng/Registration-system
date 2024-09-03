import { FaSuitcaseMedical } from "react-icons/fa6";

const Logo = ({onClick}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-white text-2xl"
    >
      <FaSuitcaseMedical className="mr-2" />
      <h1>掛掛</h1>
    </button>
  );
};

export default Logo;
