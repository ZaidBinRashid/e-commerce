import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { HiUser, HiShieldCheck, HiLogout } from "react-icons/hi";

export default function Account() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/account");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md pt-14">
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                  <HiUser className="w-10 h-10 text-slate-900" />
                </div>
                <h2 className="text-2xl font-light text-white mb-1">
                  Welcome back
                </h2>
                <p className="text-slate-300 text-lg font-medium">
                  {user.username}
                </p>
                {user.email && (
                  <p className="text-slate-400 text-sm mt-1">{user.email}</p>
                )}
              </div>

              {/* Account Info */}
              <div className="p-6 space-y-4">
                {user.role === "admin" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                    <HiShieldCheck className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Administrator
                      </p>
                      <p className="text-xs text-amber-700">
                        You have admin privileges
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  {user.role === "admin" && (
                    <button
                      onClick={() => navigate("/adminDashboard")}
                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-medium py-3 rounded-full hover:from-amber-500 hover:to-amber-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <HiShieldCheck className="w-5 h-5" />
                      Admin Dashboard
                    </button>
                  )}

                  {/* <button
                    onClick={() => navigate("/orders")}
                    className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    My Orders
                  </button> */}

                  <button
                    onClick={handleLogout}
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 font-medium py-3 rounded-full hover:border-red-300 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <HiLogout className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Auth Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-8 text-center">
                <h1 className="text-3xl font-light text-white mb-2">
                  {activeTab === "login" ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-slate-300 text-sm">
                  {activeTab === "login"
                    ? "Sign in to access your account"
                    : "Join us to start shopping"}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-4 text-center text-sm font-medium transition-all relative ${
                    activeTab === "login"
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Login
                  {activeTab === "login" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`flex-1 py-4 text-center text-sm font-medium transition-all relative ${
                    activeTab === "signup"
                      ? "text-amber-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sign Up
                  {activeTab === "signup" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-8">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === "login" ? <LoginForm /> : <SignupForm />}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                <p className="text-center text-sm text-gray-600">
                  {activeTab === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setActiveTab("signup")}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Login
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}