import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Account() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/account"); // redirect after login
    }
  }, [user, navigate]);

  if (loading)
    return <div className="text-white">Checking authentication...</div>;



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
      {user ? (
        <div className="text-center text-white">
          <p className="text-lg">Welcome, {user.username}</p>

          {user.role === "admin" && (
            <button
              onClick={() => navigate("/adminDashboard")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
            >
              Go to Admin Dashboard
            </button>
          )}

          <button
            onClick={() => {
              axios
                .post(
                  `${import.meta.env.VITE_API_URL}/api/auth/logout`,
                  {},
                  { withCredentials: true }
                )
                .then(() => setUser(null))
                .catch((err) => console.error(err));
            }}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
          <div className="flex justify-center border-b">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 p-3 text-center text-sm font-medium ${
                activeTab === "login"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 p-3 text-center text-sm font-medium ${
                activeTab === "signup"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              Sign Up
            </button>
          </div>
          <div className="p-6">
            {activeTab === "login" ? <LoginForm /> : <SignupForm />}
          </div>
        </div>
      )}
    </div>
  );
}
