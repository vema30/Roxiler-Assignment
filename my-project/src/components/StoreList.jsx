// components/StoreList.jsx
import React, { useEffect, useState } from "react";

export default function StoreList() {
 const API = "http://localhost:5000";

  const [stores, setStores] = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch store list
  const loadStores = async () => {
    setLoading(true);

    const res = await fetch(`${API}/stores`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    setStores(data.stores || []);
    setLoading(false);
  };

  useEffect(() => {
    loadStores();
  }, []);

  // Submit or update user rating
  const submitRating = async (storeId, rating) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/stores/rate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ storeId, rating })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error submitting rating");
      return;
    }

    // Update UI quickly without refetch
    setRatingMap((prev) => ({ ...prev, [storeId]: rating }));

    // OPTIONAL: Comment if you don’t want full refresh
    loadStores();
  };

  if (loading) return <div>Loading stores...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stores</h2>

      {stores.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "15px",
            borderRadius: "8px"
          }}
        >
          <h3>{s.name}</h3>
          <p>{s.address}</p>

          <p>
            Average Rating:{" "}
            {s.avgRating ? Number(s.avgRating).toFixed(2) : "No ratings yet"}
          </p>

          <p>User Rating: {ratingMap[s.id] ?? s.userRating ?? "None"}</p>

          <div>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => submitRating(s.id, n)}
                style={{ marginRight: "5px" }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
