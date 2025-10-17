// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Checking authentication...</div>;

  if (!user) return <Navigate to="/account" replace />; // redirect to your login/signup page

  return children;
}
