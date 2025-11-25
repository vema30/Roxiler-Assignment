import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UpdatePassword() {
    const API = "https://roxiler-assignment-dsck.onrender.com";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    const res = await fetch(`${API}/auth/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) return setMsg(data.message);

    setMsg("Password updated successfully!");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Update Password</h1>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Current Password"
          value={form.currentPassword}
          onChange={(e) =>
            setForm({ ...form, currentPassword: e.target.value })
          }
          required
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
          required
          className="border p-2 rounded"
        />

        <button className="bg-blue-600 text-white p-2 rounded">
          Update Password
        </button>

        {msg && <p className="text-center mt-2">{msg}</p>}
      </form>
    </div>
  );
}
