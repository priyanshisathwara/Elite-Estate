import React, { useState } from 'react';
import './AdminSideBar.css';
import { Link, useNavigate } from 'react-router-dom';

const AdminSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Add this

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // ✅ Clear stored login data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // ✅ Redirect to login page
    navigate("/admin/login");
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div className="sidebar">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? 'Close' : 'Open'}
        </button>

        <ul className="menu">
          <li><Link to="/admin">Home</Link></li>
          <li><Link to="/admin/request">Request</Link></li>
        </ul>

        {/* ✅ Logout button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div
        className={`overlay ${isOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      ></div>
    </div>
  );
};

export default AdminSideBar;
