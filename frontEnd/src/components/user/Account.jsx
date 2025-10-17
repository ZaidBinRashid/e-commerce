import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";

export default function Account() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, setUser, loading } = useAuth();

  if (loading) return <div className="text-white">Checking authentication...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
      {user ? (
        <div className="text-center text-white">
          <p className="text-lg">Welcome, {user.username}</p>
          <button
            onClick={() => {
              axios
                .post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true })
                .then(() => setUser(null))
                .catch(err => console.error(err));
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
