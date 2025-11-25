// client/src/store/actions/adminActions.js
import * as api from "../../api/adminApi";

export const loadDashboard = () => async dispatch => {
  dispatch({ type: "ADMIN_DASHBOARD_LOADING" });
  const json = await api.fetchAdminDashboard();
  if (json.success !== false) {
    dispatch({ type: "ADMIN_DASHBOARD_LOADED", payload: json });
  } else {
    dispatch({ type: "ADMIN_ERROR", payload: json.message || "Dashboard error" });
  }
};

export const loadStores = (params) => async dispatch => {
  const json = await api.fetchStoresList(params);
  if (json.success) dispatch({ type: "ADMIN_STORES_LOADED", payload: json });
};

export const loadUsers = (params) => async dispatch => {
  const json = await api.fetchUsersList(params);
  if (json.success) dispatch({ type: "ADMIN_USERS_LOADED", payload: json });
};

export const adminCreateUser = (body) => async dispatch => {
  const json = await api.createUserAdmin(body);
  return json;
};

export const adminCreateStore = (body) => async dispatch => {
  const json = await api.createStoreAdmin(body);
  return json;
};
