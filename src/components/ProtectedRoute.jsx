import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, roles } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu route yêu cầu role
  if (allowedRoles?.length) {
    const ok = roles.some((r) => allowedRoles.includes(r));
    if (!ok) return <Navigate to="/" replace />;
  }

  return children;
}

