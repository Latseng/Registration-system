import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import { MainPage, LoginPage, DepartmentPage, ClinicSchedulePage, QueryPage, DoctorsPage, AdminDepartmentPage, AdminDoctorPage, AdminAppointmentPage, AdminSchedulePage, RegisterPage  } from "./pages";
import LayoutWithSidebar from "./components/LayoutWithSidebar";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#51b6b6",
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* 一般使用者頁面 */}
          <Route path="*" element={<MainPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route element={<LayoutWithSidebar />}>
            <Route path="departments" element={<DepartmentPage />} />
            <Route
              path="departments/schedule"
              element={<ClinicSchedulePage />}
            />
            <Route path="query" element={<QueryPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            {/* 管理者頁面 */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route
                path="admin/departments"
                element={<AdminDepartmentPage />}
              />
              <Route path="admin/doctors" element={<AdminDoctorPage />} />
              <Route
                path="admin/appointments"
                element={<AdminAppointmentPage />}
              />
              <Route
                path="admin/schedules/:department"
                element={<AdminSchedulePage />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
