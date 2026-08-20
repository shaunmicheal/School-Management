import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-stone-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return user.role === "TEACHER" ? (
      <Navigate to="/teacher/dashboard" replace />
    ) : (
      <Navigate to="/admin/dashboard" replace />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
