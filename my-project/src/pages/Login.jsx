import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
    const API = "https://roxiler-assignment-dsck.onrender.com/";
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Redirect based on user role
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
    <div className="bg-blue-500 min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-xl">

        <h1 className="text-3xl md:text-4xl font-semibold mb-3 text-center">
          Sign in
        </h1>

        <p className="text-sm md:text-base text-center mb-4">
          Don't have an account?{" "}
          <Link
            to="/Register"
            className="text-blue-500 border-b border-blue-500 hover:text-blue-700"
          >
            Sign up
          </Link>
        </p>

        <form
          onSubmit={handleLogin}
          className="bg-slate-200 p-4 rounded-md flex flex-col gap-3"
        >
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 rounded-lg border border-sky-300 w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded-lg border border-sky-300 w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 text-white p-2 rounded-full w-full hover:bg-red-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {msg && (
          <p className="text-red-600 mt-3 text-center text-sm">{msg}</p>
        )}
      </div>
    </div>
  );
}
