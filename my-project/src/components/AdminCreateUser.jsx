// client/src/components/AdminCreateUser.jsx
import React, { useState } from "react";

export default function AdminCreateUser() {
  const API = "https://roxiler-assignment-dsck.onrender.com";

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API}/admin/users/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.message || "Failed to create user");
        return;
      }

      setMsg("🎉 User Created Successfully!");

      // Clear form
      setForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "",
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
      setMsg("Network error");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Create User</h2>

      <form
        onSubmit={submit}
        className="bg-white shadow-lg p-6 rounded-xl border border-gray-200 flex flex-col gap-4"
      >
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
          className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Role</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
          <option value="NORMAL_USER">Normal User</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
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
