import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import {
  MainPage,
  LoginPage,
  DepartmentPage,
  ClinicSchedulePage,
  QueryPage,
  DoctorsPage,
  AdminDepartmentPage,
  AdminDoctorPage,
  AdminDoctorSchedulesPage,
  AdminSchedulePage,
  RegisterPage,
  AdminDoctorAppointmentsPage,
  AdminPatientPage,
  AdminPatientAppointmentPage,
  UserInfoPage,
  AppointmentHistoryPage
} from "./pages";
import LayoutWithSidebar from "./components/LayoutWithSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthChecker from "./components/AuthChecker";



function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#51b6b6",
        },
      }}
    >
      {/* 登入狀態時效檢查 */}
      <AuthChecker>
        <BrowserRouter>
          <Routes>
            {/* 一般使用者頁面 */}
            <Route path="*" element={<MainPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="user" element={<UserInfoPage />} />
            <Route element={<LayoutWithSidebar />}>
              <Route path="departments" element={<DepartmentPage />} />
              <Route
                path="departments/schedule"
                element={<ClinicSchedulePage />}
              />
              <Route path="query" element={<QueryPage />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="history" element={<AppointmentHistoryPage />} />
              {/* 管理者頁面 */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route
                  path="admin/departments"
                  element={<AdminDepartmentPage />}
                />
                <Route path="admin/doctors" element={<AdminDoctorPage />} />
                <Route
                  path="admin/doctors/schedules/:doctorId"
                  element={<AdminDoctorSchedulesPage />}
                />
                <Route
                  path="admin/doctors/schedules/appointments/:doctorScheduleId"
                  element={<AdminDoctorAppointmentsPage />}
                />
                <Route
                  path="admin/schedules/:department"
                  element={<AdminSchedulePage />}
                />
                <Route path="admin/patients" element={<AdminPatientPage />} />
                <Route
                  path="/admin/patients/appointments/:patientId"
                  element={<AdminPatientAppointmentPage />}
                />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthChecker>
    </ConfigProvider>
  );
}

export default App;
