import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  //const API = import.meta.env.VITE_API_URL; // <-- backend URL from .env
const API = "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.message || "Login failed");
        return;
      }

      // Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Redirect by role
      if (data.user.role === "SYSTEM_ADMIN") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "STORE_OWNER") {
        navigate("/owner/dashboard");
      } else {
        navigate("/stores");
      }

    } catch (err) {
      setLoading(false);
      setMsg("Network error. Check backend connection.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div>
       
         <Link to={'/register'}>
         Signup ?
         </Link>
        </div>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}
