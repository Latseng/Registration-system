import { forwardRef } from "react";

const DropdownProfile = forwardRef((_, ref) => {
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  }

  return (
    <div
      ref={ref}
      className="absolute border z-30 border-gray-200 text-center rounded-lg cursor-pointer w-20 top-12 right-2 bg-white"
    >
      <ul>
        <li className="hover:bg-mainColorLight rounded-lg hover:text-white">個人資訊</li>
        <li onClick={handleLogout} className="hover:bg-mainColorLight rounded-lg hover:text-white">登出</li>
      </ul>
    </div>
  );
})

export default DropdownProfile