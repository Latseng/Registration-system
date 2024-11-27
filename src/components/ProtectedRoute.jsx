import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
console.log(isAuthenticated);

  // 如果未登入或權限不足，跳轉到登入頁或提示頁
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    console.log("使用者權限錯誤");
    
    // return <Navigate to="/not-authorized" />;
  }

  // 通過驗證，渲染子元件
  return <Outlet />
};

export default ProtectedRoute;
