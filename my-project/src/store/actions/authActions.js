// store/actions/authActions.js
export const login = (email, password) => async dispatch => {
  const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }), headers:{'Content-Type':'application/json'} });
  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    dispatch({ type: "AUTH_SUCCESS", payload: data.user });
  } else {
    dispatch({ type: "AUTH_ERROR", payload: data.message });
  }
};
