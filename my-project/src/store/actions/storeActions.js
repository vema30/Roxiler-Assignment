// store/actions/storeActions.js
export const fetchStores = (query = {}) => async (dispatch, getState) => {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(query).toString();
  const res = await fetch(`/api/stores?${params}`, { headers: { Authorization: `Bearer ${token}` }});
  const json = await res.json();
  dispatch({ type: "SET_STORES", payload: json.stores });
};
