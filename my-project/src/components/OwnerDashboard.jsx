// client/src/components/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";

export default function OwnerDashboard() {
  const API = "http://localhost:5000";

  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  const loadOwnerData = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/owner/dashboard`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg(json.message || "Unable to load dashboard");
        return;
      }

      setData(json.data || []);
    } catch (err) {
      setMsg("Network error");
      console.error(err);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Store Owner Dashboard</h2>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      {data.length === 0 ? (
        <div>No stores found for this owner</div>
      ) : (
        data.map((store) => (
          <div
            key={store.id}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              borderRadius: "8px"
            }}
          >
            <h3>
              {store.name} — Avg:{" "}
              {store.avgRating ? Number(store.avgRating).toFixed(2) : "—"}
            </h3>

            <p>Address: {store.address}</p>
            <p>Total Ratings: {store.ratingsCount}</p>

            <h4>Raters:</h4>
            <ul>
              {store.ratings.map((r) => (
                <li key={r.id}>
                  <strong>{r.user?.name}</strong> ({r.user?.email}) —{" "}
                  <b>{r.rating}</b> — {r.comment || ""}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
