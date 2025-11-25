// components/StoreList.jsx
import React, { useEffect, useState } from "react";

export default function StoreList() {
  const API = "http://localhost:5000";

  const [stores, setStores] = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const [loading, setLoading] = useState(true);

  const loadStores = async () => {
    setLoading(true);

    const res = await fetch(`${API}/stores`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setStores(data.stores || []);
    setLoading(false);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const submitRating = async (storeId, rating) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/stores/rate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storeId, rating }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error submitting rating");
      return;
    }

    setRatingMap((prev) => ({ ...prev, [storeId]: rating }));
    loadStores();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center p-10 text-xl font-semibold">
        Loading stores...
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Stores</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {stores.map((s) => (
          <div
            key={s.id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200"
          >
            <h3 className="text-xl font-semibold mb-1">{s.name}</h3>
            <p className="text-gray-600 mb-2">{s.address}</p>

            <p className="font-medium text-gray-800">
              ⭐ Average Rating:{" "}
              <span className="font-bold">
                {s.avgRating ? Number(s.avgRating).toFixed(2) : "No ratings yet"}
              </span>
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Your Rating:{" "}
              <span className="font-semibold">
                {ratingMap[s.id] ?? s.userRating ?? "None"}
              </span>
            </p>

            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => submitRating(s.id, n)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
