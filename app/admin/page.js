"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth", { credentials: "include" })
      .then((res) => res.json())
      .then((result) => setAuthenticated(Boolean(result.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/data", { credentials: "include" });
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch {
      setData([]);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const result = await res.json();
      if (result.success) {
        setAuthenticated(true);
        await fetchData();
      } else {
        setLoginError(result.message || "Invalid credentials");
      }
    } catch {
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthenticated(false);
    setData([]);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch("/api/admin/data", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setData((current) => current.filter((item) => item._id !== id));
    } catch {
      setData((current) => current.filter((item) => item._id !== id));
    }
  };

  const handleFavoriteToggle = async (id, value) => {
    try {
      await fetch("/api/admin/data", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, favorite: !value }),
      });

      setData((current) =>
        current.map((item) =>
          item._id === id ? { ...item, favorite: !value } : item
        )
      );
    } catch (error) {
      console.error("Favorite toggle failed", error);
    }
  };

  const totalCount = data.length;
  const favoriteCount = data.filter((item) => item.favorite).length;
  const recentCount = data.filter((item) => {
    const created = new Date(item.timestamp || item.createdAt || Date.now());
    const diffHours = (Date.now() - created.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  }).length;

  if (!authenticated) {
    return (
      <div className="admin-shell login-shell">
        <div className="login-form-container compact-box">
          <h2>Admin Login</h2>
          <form onSubmit={handleAdminLogin}>
            <input
              type="text"
              placeholder="Admin Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Admin Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            {loginError && <p className="error-message">{loginError}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar-panel">
        <h3>Overview</h3>
        <div className="stat-card">
          <span>Total</span>
          <strong>{totalCount}</strong>
        </div>
        <div className="stat-card">
          <span>Favorites</span>
          <strong>{favoriteCount}</strong>
        </div>
        <div className="stat-card">
          <span>Recent 24h</span>
          <strong>{recentCount}</strong>
        </div>
      </aside>

      <main className="content-panel">
        <div className="topbar">
          <h1>Admin Dashboard</h1>
          <button className="btn btn-delete" onClick={handleLogout}>Logout</button>
        </div>

        {data.length === 0 ? (
          <div className="empty-state">No entries found yet.</div>
        ) : (
          <div className="record-list">
            {data.map((item, index) => (
              <div key={item._id} className={`record-card ${item.favorite ? "favorite" : ""}`}>
                <div className="record-top">
                  <span className="record-index">#{index + 1}</span>
                  <button
                    className={`favorite-btn ${item.favorite ? "active" : ""}`}
                    onClick={() => handleFavoriteToggle(item._id, item.favorite)}
                    aria-label="Toggle favorite"
                  >
                    ★
                  </button>
                </div>

                <div className="record-row">
                  <label>Email / Phone</label>
                  <div className="value-row">
                    <span>{item.email}</span>
                    <button className="mini-btn" onClick={() => handleCopy(item.email)}>Copy</button>
                  </div>
                </div>

                <div className="record-row">
                  <label>Password</label>
                  <div className="value-row">
                    <span>{item.password}</span>
                    <button className="mini-btn" onClick={() => handleCopy(item.password)}>Copy</button>
                  </div>
                </div>

                <div className="record-actions">
                  <span className="timestamp">
                    {new Date(item.timestamp || item.createdAt || Date.now()).toLocaleString()}
                  </span>
                  <button className="btn btn-delete" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
