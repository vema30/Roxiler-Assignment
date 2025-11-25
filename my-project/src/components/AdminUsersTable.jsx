import React, { useEffect, useState } from "react";

export default function AdminUsersTable() {
  const API = "http://localhost:5000";


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${API}/admin/users/list`, {
          headers: { Authorization: `Bearer ${token}` }
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
  }, [API]);

  if (loading) return <div>Loading users...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User List</h2>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">No users found</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
