// client/src/components/AdminCreateStore.jsx
import React, { useState } from "react";

export default function AdminCreateStore() {
  //const API = import.meta.env.VITE_API_URL;
const API = "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
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
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(form)
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
        ownerId: ""
      });

    } catch (err) {
      setLoading(false);
      console.error(err);
      setMsg("Network error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Store</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Store Name"
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
        />
        <br />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          required
        />
        <br />

        <input
          placeholder="Owner ID (optional)"
          value={form.ownerId}
          onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>

      {msg && (
        <p
          style={{
            marginTop: "10px",
            color: msg.includes("🎉") ? "green" : "red"
          }}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
