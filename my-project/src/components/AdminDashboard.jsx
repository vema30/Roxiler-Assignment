// client/src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const API = "http://localhost:5000";

  const [dash, setDash] = useState(null);
  const [msg, setMsg] = useState("");

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/admin/stores/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Failed to load admin dashboard");
        return;
      }

      setDash(data);
    } catch (err) {
      console.error(err);
      setMsg("Network error");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!dash)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

      {msg && <p className="text-red-600 text-center mb-4">{msg}</p>}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">

        <div className="bg-white shadow-md rounded-xl p-6 text-center border border-gray-200">
          <strong className="text-xl">Total Users</strong>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            {dash.totalUsers}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center border border-gray-200">
          <strong className="text-xl">Total Stores</strong>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {dash.totalStores}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center border border-gray-200">
          <strong className="text-xl">Total Ratings</strong>
          <div className="text-3xl font-bold text-yellow-600 mt-2">
            {dash.totalRatings}
          </div>
        </div>

      </div>
    </div>
  );
}
