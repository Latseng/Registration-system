import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage, LoginPage, DepartmentPage, RecordsPage, ClinicSchedulePage, QueryPage, DoctorsPage, AdminDepartmentPage } from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="departments" element={<DepartmentPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="*" element={<MainPage />} />
          <Route path="departments/schedule" element={<ClinicSchedulePage />} />
          <Route path="query" element={<QueryPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="admin/departments" element={<AdminDepartmentPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
