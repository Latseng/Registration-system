import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainPage, LoginPage, DepartmentPage, RecordsPage } from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="department" element={<DepartmentPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="*" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
