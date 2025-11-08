import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  HiShoppingBag,
  HiTrash,
  HiChartBar,
  HiMenu,
  HiX,
  HiLogout,
  HiShieldCheck,
} from "react-icons/hi";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { to: "allProducts", label: "Products", icon: HiShoppingBag },
    { to: "AllTestimonials", label: "Testimonials", icon: HiTrash },
    // { to: "analytics", label: "Analytics", icon: HiChartBar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-700 p-2"
        >
          {sidebarOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen bg-gradient-to-br from-slate-800 to-slate-900 w-72 flex-shrink-0 transition-transform duration-300 z-40 pt-20 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full p-6">
            {/* Profile Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg">
                  <HiShieldCheck className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">{user.username}</p>
                  <p className="text-slate-300 text-sm capitalize">{user.role}</p>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-3">
                <p className="text-slate-300 text-xs uppercase tracking-wider mb-1">
                  Admin Panel
                </p>
                <p className="text-white text-sm">Heritage Watches Co</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? "bg-amber-400 text-slate-900 shadow-lg"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="border-t border-slate-700 pt-4 space-y-2">
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="font-medium">Back to Store</span>
              </button>
              
              <button
                onClick={() => navigate("/account")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all"
              >
                <HiLogout className="w-5 h-5" />
                <span className="font-medium">Exit Admin</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:p-8 p-4 min-h-screen ">
          {/* Header - Desktop Only */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your products, testimonials, and analytics
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;