import { Routes, Route } from "react-router-dom";
import MainSite from "./pages/MainSite";
import AdminDashboard from "./admin/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import GalleriesPage from "./pages/GalleriesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/galerias" element={<GalleriesPage />} />
    </Routes>
  );
}
