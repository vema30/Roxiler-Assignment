import React from "react";
import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white p-6 flex flex-col gap-4 border-2 border-white">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        <Link className="hover:bg-blue-800 p-2 rounded" to="/admin/dashboard">
          Dashboard
        </Link>

        <Link className="hover:bg-blue-800 p-2 rounded" to="/admin/create-user">
          Create User
        </Link>

        <Link className="hover:bg-blue-800 p-2 rounded" to="/admin/create-store">
          Create Store
        </Link>

        <Link className="hover:bg-blue-800 p-2 rounded" to="/admin/stores">
          Stores List
        </Link>

        <Link className="hover:bg-blue-800 p-2 rounded" to="/admin/users">
          Users List
        </Link>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
