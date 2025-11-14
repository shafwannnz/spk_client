import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import StudentManagement from "./pages/admin/StudentManagement.jsx";
import CriteriaManagement from "./pages/admin/CriteriaManagement.jsx";
import TeacherManagement from "./pages/admin/TeacherManagement.jsx";
import AhpProcess from "./pages/admin/AhpProcess.jsx";
import ReportCenter from "./pages/admin/ReportCenter.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/dashboard/siswa" element={<StudentManagement />} />
      <Route path="/dashboard/kriteria" element={<CriteriaManagement />} />
      <Route path="/dashboard/guru" element={<TeacherManagement />} />
      <Route path="/dashboard/ahp" element={<AhpProcess />} />
      <Route path="/dashboard/laporan" element={<ReportCenter />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}