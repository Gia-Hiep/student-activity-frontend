import { Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Layout/Header";

export default function AppLayout() {
  const { roles } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roles?.length) return;

    // Nếu user đang cố vào /admin nhưng không có quyền admin
    const isAdminPage = location.pathname.startsWith("/admin");

    const isAdmin =
      roles.includes("ROLE_Admin") ||
      roles.includes("ROLE_Cán bộ khoa") ||
      roles.includes("ROLE_Cán sự lớp") ||
      roles.includes("ROLE_Liên chi hội");

    if (isAdminPage && !isAdmin) {
      navigate("/", { replace: true });
    }

    // Nếu sinh viên (chỉ ROLE_Sinh viên) vào /admin → đẩy ra dashboard
    const isStudentOnly =
      roles.length === 1 && roles.includes("ROLE_Sinh viên");

    if (isStudentOnly && isAdminPage) {
      navigate("/", { replace: true });
    }
  }, [roles, location.pathname]);

  return (
    <ProtectedRoute>
      <Layout style={{ minHeight: "100vh" }}>
        <Header />
        <Layout.Content className="p-6 bg-gray-50">
          <Outlet />
        </Layout.Content>
      </Layout>
    </ProtectedRoute>
  );
}
