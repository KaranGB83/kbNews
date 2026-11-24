import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, checkingAuth } = useAuth();

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center py-32">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user.role !== "admin" && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
