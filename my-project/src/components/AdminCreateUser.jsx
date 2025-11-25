// client/src/components/AdminCreateUser.jsx
import React, { useState } from "react";

export default function AdminCreateUser() {
 // const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: ""
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
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
        role: ""
      });

    } catch (err) {
      setLoading(false);
      console.error(err);
      setMsg("Network error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create User</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <br />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        >
          <option value="">Select Role</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
          <option value="NORMAL_USER">Normal User</option>
        </select>
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {msg && <p style={{ marginTop: "10px", color: msg.includes("🎉") ? "green" : "red" }}>{msg}</p>}
    </div>
  );
}
