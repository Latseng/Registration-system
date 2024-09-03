import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage, LoginPage, DepartmentPage, RecordsPage, ClinicSchedulePage } from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="department" element={<DepartmentPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="*" element={<MainPage />} />
          <Route path="schedule" element={<ClinicSchedulePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
