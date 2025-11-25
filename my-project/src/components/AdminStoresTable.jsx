// client/src/components/AdminStoresTable.jsx
import React, { useEffect, useState } from "react";

export default function AdminStoresTable() {
   const API = "https://roxiler-assignment-dsck.onrender.com/";

  const [storesData, setStoresData] = useState(null);
  const [msg, setMsg] = useState("");

  // Params for sorting & pagination
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    sort: "name",
    order: "asc",
  });

  const loadStores = async () => {
    const token = localStorage.getItem("token");
    const query = new URLSearchParams(params).toString();

    try {
      const res = await fetch(`${API}/admin/stores/list?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  if (!storesData)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading stores...
      </div>
    );

  const { data, meta } = storesData;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Stores List</h2>

      {msg && <p className="text-red-600 text-center mb-4">{msg}</p>}

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-300"
                onClick={() => toggleSort("name")}
              >
                Name
              </th>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-300"
                onClick={() => toggleSort("email")}
              >
                Email
              </th>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-300"
                onClick={() => toggleSort("address")}
              >
                Address
              </th>
              <th
                className="p-3 text-left cursor-pointer hover:bg-gray-300"
                onClick={() => toggleSort("avgRating")}
              >
                Avg Rating
              </th>
              <th className="p-3 text-left">Ratings Count</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-600 bg-gray-50"
                >
                  No stores found
                </td>
              </tr>
            ) : (
              data.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.address}</td>
                  <td className="p-3 font-semibold">
                    {s.avgRating ? Number(s.avgRating).toFixed(2) : "—"}
                  </td>
                  <td className="p-3">{s.ratingsCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 text-center text-gray-700 font-semibold">
        Page {meta.page} / {Math.ceil(meta.total / meta.limit)}
      </div>
    </div>
  );
}
