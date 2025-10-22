import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"

const AdminDashboard = () => {
   const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col md:flex-row border border-gray-400">
      {/* Sidebar */}
      <aside className="bg-gray-300 w-full md:w-64 flex flex-col items-center py-8 space-y-6 rounded-2xl m-2">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-black"></div>
          <p className="text-lg text-center font-small">
            {user.role} | {user.username}
          </p>
        </div>

        {/* Navigation */}
        <nav className="bg-white w-3/4 md:w-48 rounded-2xl py-6 flex flex-col space-y-4 text-center shadow-md">
          <NavLink
            to="allProducts"
            className={({ isActive }) =>
              `py-2 rounded-md font-medium ${
                isActive ? "bg-gray-200 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
           All Products
          </NavLink>
          <NavLink
            to="addProducts"
            className={({ isActive }) =>
              `py-2 rounded-md font-medium ${
                isActive ? "bg-gray-200 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
           Add Products
          </NavLink>
          <NavLink
            to="deleteProducts"
            className={({ isActive }) =>
              `py-2 rounded-md font-medium ${
                isActive ? "bg-gray-200 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
           Delete Products
          </NavLink>
          <NavLink
            to="updateProduct/:id"
            className={({ isActive }) =>
              `py-2 rounded-md font-medium ${
                isActive ? "bg-gray-200 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
           Update Products
          </NavLink>
          <NavLink
            to="analytics"
            className={({ isActive }) =>
              `py-2 rounded-md font-medium ${
                isActive ? "bg-gray-200 text-blue-600" : "hover:bg-gray-100"
              }`
            }
          >
            Analytics
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <div className="w-full h-[700px] border border-gray-300  rounded-2xl flex items-center justify-center">
          <Outlet/>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
