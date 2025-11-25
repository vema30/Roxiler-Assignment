// client/src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
 // const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:5000";

  const [dash, setDash] = useState(null);
  const [msg, setMsg] = useState("");

  const loadDashboard = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/admin/stores/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

  if (!dash) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
        <div
          style={{
            padding: "12px",
            background: "#f6f6f6",
            borderRadius: "8px",
            minWidth: "150px",
            textAlign: "center"
          }}
        >
          <strong>Total Users</strong>
          <div>{dash.totalUsers}</div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#f6f6f6",
            borderRadius: "8px",
            minWidth: "150px",
            textAlign: "center"
          }}
        >
          <strong>Total Stores</strong>
          <div>{dash.totalStores}</div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "#f6f6f6",
            borderRadius: "8px",
            minWidth: "150px",
            textAlign: "center"
          }}
        >
          <strong>Total Ratings</strong>
          <div>{dash.totalRatings}</div>
        </div>
      </div>
    </div>
  );
}
