import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
   const API = "https://roxiler-assignment-dsck.onrender.com/";
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
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
        body: JSON.stringify(form),
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
    <div className="bg-blue-600 min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-md shadow-xl">

        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          Register
        </h2>

        <p className="text-sm md:text-base text-center mb-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 border-b border-blue-500 hover:text-blue-700"
          >
            Login
          </Link>
        </p>

        <form
          onSubmit={submit}
          className="bg-slate-200 p-4 rounded-md flex flex-col gap-3"
        >
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="p-2 rounded-lg border border-sky-300 w-full"
          />

          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="p-2 rounded-lg border border-sky-300 w-full"
          />

          <input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="p-2 rounded-lg border border-sky-300 w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="p-2 rounded-lg border border-sky-300 w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 text-white p-2 rounded-full w-full hover:bg-red-600 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {msg && (
          <p className="text-red-600 mt-3 text-center text-sm">{msg}</p>
        )}
      </div>
    </div>
  );
}
