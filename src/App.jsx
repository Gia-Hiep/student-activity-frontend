// src/App.jsx (hoặc App.js)
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Layout } from "antd";
import Header from "./components/Layout/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css';
// Trang chung
import LoginPage from "./pages/Auth/LoginPage";

// Trang sinh viên
import Dashboard from "./pages/Student/Dashboard";
import ActivityList from "./pages/Student/ActivityList";
import MyRegistrations from "./pages/Student/MyRegistrations";
import SubmitEvidence from "./pages/Student/SubmitEvidence";
import MyScore from "./pages/Student/MyScore";
import ActivityDetail from "./pages/Student/ActivityDetail";
import MyEvidences from "./pages/Student/MyEvidences";
import MyComplaints from "./pages/Student/MyComplaints";
import DrlInfo from "./pages/Student/DrlInfo";
import ProfilePage from "./pages/Student/ProfilePage";
import FacultyClassBrowser from "./pages/Student/FacultyClassBrowser";

// Trang admin
import ActivityManagement from "./pages/Admin/ActivityManagement";
import ApprovalList from "./pages/Admin/ApprovalList";
import UserManagement from "./pages/Admin/UserManagement";
import AttendanceManagement from "./pages/Admin/AttendanceManagement";
import DrlConfigManagement from "./pages/Admin/DrlConfigManagement";
import ComplaintManagement from "./pages/Admin/ComplaintManagement";
import FacultyManagement from "./pages/Admin/FacultyManagement";
import ClassManagement from "./pages/Admin/ClassManagement";
import ReportExport from "./pages/Admin/ReportExport";
import DeployFacultyActivities from "./pages/Admin/DeployFacultyActivities";

const { Content } = Layout;

// Nhóm quyền
const ORGANIZER_ROLES = [
  "ROLE_Cán sự lớp",
  "ROLE_Liên chi hội",
  "ROLE_Cán bộ khoa",
  "ROLE_Admin",
];

const APPROVER_ROLES = [
  "ROLE_Cán sự lớp",
  "ROLE_Liên chi hội",
  "ROLE_Cán bộ khoa",
  "ROLE_Admin",
];

const CLASS_LEVEL_ROLES = [
  "ROLE_Cán sự lớp",
  "ROLE_Liên chi hội",
];

const FACULTY_ROLES = ["ROLE_Cán bộ khoa", "ROLE_Admin"];
const ADMIN_ONLY = ["ROLE_Admin"];

function AppLayout() {
  return (
    <ProtectedRoute>
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* LAYOUT SINH VIÊN */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="activities" element={<ActivityList />} />
          <Route path="activities/:id" element={<ActivityDetail />} />
          <Route path="registrations/my" element={<MyRegistrations />} />
          <Route path="submit-evidence/:id" element={<SubmitEvidence />} />
          <Route path="my-score" element={<MyScore />} />
          <Route path="my-evidences" element={<MyEvidences />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="drl-info" element={<DrlInfo />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="faculties-classes" element={<FacultyClassBrowser />} />

          {/* LAYOUT ADMIN */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={ORGANIZER_ROLES}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Mặc định: quản lý hoạt động (Khoa hoặc Lớp tuỳ role) */}
            <Route index element={<ActivityManagement />} />
            <Route path="activities" element={<ActivityManagement />} />

            {/* Cán sự lớp / Liên chi hội: nhận từ Khoa */}
            <Route
              path="deploy"
              element={
                <ProtectedRoute allowedRoles={CLASS_LEVEL_ROLES}>
                  <DeployFacultyActivities />
                </ProtectedRoute>
              }
            />

            {/* Duyệt minh chứng và điểm danh */}
            <Route
              path="approval"
              element={
                <ProtectedRoute allowedRoles={APPROVER_ROLES}>
                  <ApprovalList />
                </ProtectedRoute>
              }
            />
            <Route
              path="attendance"
              element={
                <ProtectedRoute allowedRoles={ORGANIZER_ROLES}>
                  <AttendanceManagement />
                </ProtectedRoute>
              }
            />

            {/* Cán bộ khoa */}
            <Route
              path="drl-config"
              element={
                <ProtectedRoute allowedRoles={FACULTY_ROLES}>
                  <DrlConfigManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="complaints"
              element={
                <ProtectedRoute allowedRoles={FACULTY_ROLES}>
                  <ComplaintManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="classes"
              element={
                <ProtectedRoute allowedRoles={FACULTY_ROLES}>
                  <ClassManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={FACULTY_ROLES}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="report"
              element={
                <ProtectedRoute allowedRoles={FACULTY_ROLES}>
                  <ReportExport />
                </ProtectedRoute>
              }
            />

            {/* Admin ONLY */}
            <Route
              path="faculties"
              element={
                <ProtectedRoute allowedRoles={ADMIN_ONLY}>
                  <FacultyManagement />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="text-center text-2xl mt-20">
                404 - Không tìm thấy trang
              </div>
            }
          />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}
