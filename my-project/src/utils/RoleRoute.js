import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Save role during login

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" />;

  return children;
}
