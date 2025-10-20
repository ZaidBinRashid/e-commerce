import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  if (!user) {
    // not logged in at all
    return <Navigate to="/account" replace />;
  }

  if (user.role !== "admin") {
    // logged in but not admin
    return <Navigate to="/" replace />;
  }

  // ✅ user is admin → allow access
  return children;
}
