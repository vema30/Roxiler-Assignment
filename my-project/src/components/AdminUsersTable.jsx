import React, { useEffect, useState } from "react";

export default function AdminUsersTable() {
  const API = "https://roxiler-assignment-dsck.onrender.com/";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API}/admin/users/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setMsg(data.message || "Failed to load users");
          return;
        }

        setUsers(data.data || []);
      } catch (err) {
        console.error(err);
        setMsg("Network error");
      }

      setLoading(false);
    };

    loadUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading users...
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">User List</h2>

      {msg && <p className="text-red-600 text-center mb-4">{msg}</p>}

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-4 text-center text-gray-600 bg-gray-50"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id || u.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.address}</td>
                  <td className="p-3 font-semibold">{u.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
