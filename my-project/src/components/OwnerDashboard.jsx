// client/src/components/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";

export default function OwnerDashboard() {
    const API = "https://roxiler-assignment-dsck.onrender.com/";

  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  const loadOwnerData = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/owner/dashboard`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
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

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading...
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Store Owner Dashboard
      </h2>

      {msg && <p className="text-red-600 text-center mb-4">{msg}</p>}

      {data.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          You have not created any stores yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {data.map((store) => (
            <div
              key={store.id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold mb-1">
                {store.name}
                <span className="text-gray-600 text-sm ml-2">
                  — Avg:{" "}
                  <b>
                    {store.avgRating
                      ? Number(store.avgRating).toFixed(2)
                      : "—"}
                  </b>
                </span>
              </h3>

              <p className="text-gray-700">Address: {store.address}</p>
              <p className="text-gray-700 mb-3">
                Total Ratings: {store.ratingsCount}
              </p>

              <h4 className="text-lg font-semibold mb-2">Raters</h4>

              <ul className="space-y-2">
                {store.ratings.length === 0 && (
                  <p className="text-gray-500 text-sm">No ratings yet</p>
                )}

                {store.ratings.map((r) => (
                  <li
                    key={r.id}
                    className="bg-gray-100 p-2 rounded-lg flex flex-col"
                  >
                    <span className="font-bold">
                      {r.user?.name}{" "}
                      <span className="text-sm text-gray-500">
                        ({r.user?.email})
                      </span>
                    </span>

                    <span className="text-blue-600 font-semibold">
                      ⭐ Rating: {r.rating}
                    </span>

                    {r.comment && (
                      <span className="text-gray-600 mt-1 text-sm">
                        “{r.comment}”
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
