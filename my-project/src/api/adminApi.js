// client/src/api/adminApi.js
const API_BASE = "https://localhost:5000/api/v1/admin";
 // or "/api/admin" depending your server
function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: token ? `Bearer ${token}` : "" , "Content-Type": "application/json" };
}

export async function fetchAdminDashboard() {
  const res = await fetch(`${API_BASE}/stores/dashboard`, { headers: authHeaders() });
  return res.json();
}

export async function fetchStoresList(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/stores/list?${qs}`, { headers: authHeaders() });
  return res.json();
}

export async function fetchUsersList(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/admin/users/list?${qs}`, { headers: authHeaders() });
  return res.json();
}

export async function createUserAdmin(body) {
  const res = await fetch(`/admin/users/create-user`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
  return res.json();
}

export async function createStoreAdmin(body) {
  const res = await fetch(`/admin/stores`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
  return res.json();
}
