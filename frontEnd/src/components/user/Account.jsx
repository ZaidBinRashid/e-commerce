import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function Account() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md">
        {/* Tabs */}
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

        {/* Render Form */}
        <div className="p-6">
          {activeTab === "login" ? <LoginForm /> : <SignupForm />}
        </div>
      </div>
    </div>
  );
}
