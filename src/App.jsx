import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import { MainPage, LoginPage, DepartmentPage, RecordsPage, ClinicSchedulePage, QueryPage, DoctorsPage, AdminDepartmentPage } from "./pages";

function App() {
  return (
    <ConfigProvider
            theme={{
              token: {
                // Seed Token
                colorPrimary: "#51b6b6",

               
              },
            }}
          >
      <BrowserRouter>
        <Routes>
          
            <Route path="login" element={<LoginPage />} />
            <Route path="departments" element={<DepartmentPage />} />
            <Route path="records" element={<RecordsPage />} />
            <Route path="*" element={<MainPage />} />
            <Route
              path="departments/schedule"
              element={<ClinicSchedulePage />}
            />
            <Route path="query" element={<QueryPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="admin/departments" element={<AdminDepartmentPage />} />
          
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
