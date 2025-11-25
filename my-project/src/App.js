// client/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./components/AdminDashboard";
import AdminCreateUser from "./components/AdminCreateUser";
import AdminCreateStore from "./components/AdminCreateStore";
import AdminStoresTable from "./components/AdminStoresTable";
import AdminUsersTable from "./components/AdminUsersTable";

import OwnerDashboard from "./components/OwnerDashboard";
import StoreList from "./components/StoreList";

import ProtectedRoute from "./utils/ProtectedRoute";
import RoleRoute from "./utils/RoleRoute";
import Navbar from "./components/Navbar";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>
<Navbar/>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Normal User */}
        <Route
          path="/stores"
          element={
            <ProtectedRoute>
              <StoreList />
            </ProtectedRoute>
          }
        />

        {/* Store Owner */}
        <Route
          path="/owner/dashboard"
          element={
            <RoleRoute allowedRoles={["STORE_OWNER"]}>
              <OwnerDashboard />
            </RoleRoute>
          }
        />

        {/* ADMIN ROUTES WITH LAYOUT */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RoleRoute>
          }
        />

        <Route
          path="/admin/create-user"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminLayout>
                <AdminCreateUser />
              </AdminLayout>
            </RoleRoute>
          }
        />

        <Route
          path="/admin/create-store"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminLayout>
                <AdminCreateStore />
              </AdminLayout>
            </RoleRoute>
          }
        />

        <Route
          path="/admin/stores"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminLayout>
                <AdminStoresTable />
              </AdminLayout>
            </RoleRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminLayout>
                <AdminUsersTable />
              </AdminLayout>
            </RoleRoute>
          }
        />

        {/* DEFAULT → LOGIN */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
