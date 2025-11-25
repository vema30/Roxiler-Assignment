// client/src/components/AdminStoresTable.jsx
import React, { useEffect, useState } from "react";

export default function AdminStoresTable() {
 // const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:5000";

  const [storesData, setStoresData] = useState(null);
  const [msg, setMsg] = useState("");

  // Params for sorting & pagination
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: "name",
    order: "asc"
  });

  // Fetch admin stores from backend
  const loadStores = async () => {
    const token = localStorage.getItem("token");

    const query = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${API}/admin/stores/list?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Failed to load stores");
        return;
      }

      setStoresData(data);
    } catch (err) {
      console.error(err);
      setMsg("Network error");
    }
  };

  useEffect(() => {
    loadStores();
  }, [params]);

  const toggleSort = (field) => {
    setParams((prev) => ({
      ...prev,
      sort: field,
      order: prev.order === "asc" ? "desc" : "asc"
    }));
  };

  if (!storesData) return <div>Loading stores...</div>;

  const { data, meta } = storesData;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stores List</h2>
      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
              Name
            </th>
            <th onClick={() => toggleSort("email")} style={{ cursor: "pointer" }}>
              Email
            </th>
            <th onClick={() => toggleSort("address")} style={{ cursor: "pointer" }}>
              Address
            </th>
            <th onClick={() => toggleSort("avgRating")} style={{ cursor: "pointer" }}>
              Avg Rating
            </th>
            <th>Ratings Count</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="5">No stores found</td>
            </tr>
          ) : (
            data.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.avgRating ? Number(s.avgRating).toFixed(2) : "—"}</td>
                <td>{s.ratingsCount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <strong>
          Page {meta.page} / {Math.ceil(meta.total / meta.limit)}
        </strong>
      </div>
    </div>
  );
}
