import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  //const API = import.meta.env.VITE_API_URL; // backend url from .env
const API = "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: ""
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.message || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      navigate("/stores");

    } catch (err) {
      setLoading(false);
      setMsg("Network error. Check backend connection.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

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

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}
