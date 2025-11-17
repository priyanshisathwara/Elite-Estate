import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("http://localhost:8000/api/auth/login", { email, password });

    const { token, user } = res.data;
    const role = user?.role;

    // Store token and role
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    if (role === "admin") {
      navigate("/admin/");
    } else {
      setError("Access denied: Not an admin");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
