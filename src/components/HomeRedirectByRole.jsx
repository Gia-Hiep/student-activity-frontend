import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function HomeRedirectByRole() {
  const { roles } = useSelector((s) => s.auth);

  if (!roles) return <Navigate to="/login" replace />;

  if (roles.includes("ROLE_Admin"))
    return <Navigate to="/admin/faculties" replace />;
  if (roles.includes("ROLE_Cán bộ khoa"))
    return <Navigate to="/admin/approval" replace />;
  if (roles.includes("ROLE_Cán sự lớp") || roles.includes("ROLE_Liên chi hội"))
    return <Navigate to="/admin/activities" replace />;

  return <Navigate to="/dashboard" replace />;
}
