export function saveAuth({ token, username, user_id, expires_in }) {
  if (token) localStorage.setItem("token", token);

  // Optional fields
  if (username) localStorage.setItem("username", username);
  if (user_id) localStorage.setItem("user_id", user_id);

  // expiry (optional)
  if (expires_in) {
    const expiry = Date.now() + Number(expires_in) * 1000;
    localStorage.setItem("tokenExpiry", String(expiry));
  }
}

export function getToken() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");

  if (expiry && Date.now() > Number(expiry)) {
    clearAuth();
    return null;
  }
  return token;
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("username");
  localStorage.removeItem("user_id");
}

export function isAuthed() {
  return !!getToken();
}
