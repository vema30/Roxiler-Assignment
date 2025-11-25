// client/src/components/AdminCreateStore.jsx
import React, { useState } from "react";

export default function AdminCreateStore() {
  
  const API = "https://roxiler-assignment-dsck.onrender.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/admin/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.message || "Error creating store");
        return;
      }

      setMsg("🎉 Store Created Successfully!");

      // Clear form
      setForm({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
      setMsg("Network error");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Create Store</h2>

      <form
        onSubmit={submit}
        className="bg-white shadow-lg p-6 rounded-xl border border-gray-200 flex flex-col gap-4"
      >
        <input
          placeholder="Store Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Email (optional)"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Owner ID (optional)"
          value={form.ownerId}
          onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>

      {msg && (
        <p
          className={`mt-4 text-center text-lg font-semibold ${
            msg.includes("🎉") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
