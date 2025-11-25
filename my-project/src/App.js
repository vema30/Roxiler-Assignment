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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
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

        {/* System Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        
        <Route
          path="/admin/create-user"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminCreateUser />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/create-store"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminCreateStore />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/stores"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminStoresTable />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={["SYSTEM_ADMIN"]}>
              <AdminUsersTable />
            </RoleRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
