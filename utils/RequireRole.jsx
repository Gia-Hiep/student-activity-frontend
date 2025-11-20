import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RequireRole({ allowed, children }) {
  const user = useSelector((s) => s.auth.user);
  const roles = user?.roles || []; 

  const hasRole = roles.some((r) => allowed.includes(r));
  if (!hasRole) return <Navigate to="/403" replace />;

  return children;
}
