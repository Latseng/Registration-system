import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  // 如果未登入，導向登入頁
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  // 沒有管理者權限，導向使用者功能頁面
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/departments" />;
  }
  // 通過驗證，渲染子元件
  return <Outlet />
};

export default ProtectedRoute;
