import { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let storedUser = null;
    try {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        storedUser = JSON.parse(userData);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
    }
    setUser(storedUser);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      {/* Logo */}
      <div className="logo">
        <span className="black-text">Elite</span>
        <span className="blue-text">Estate.</span>
      </div>

      {/* Hamburger menu icon */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Navigation Links */}
      <div className={`nav-link-detail ${menuOpen ? "active" : ""}`}>
        <ul className="nav-links">
          <Link to="/"><li className="active">Home</li></Link>
          <Link to="/about-us"><li>About Us</li></Link>
          <Link to="/places"><li>Places</li></Link>

          {/* Actions inside menu for mobile */}
          <div className="nav-actions">
            {user ? (
              location.pathname === "/profile" ? (
                <div className="profile-dropdown">
                  <ul className="profile-menu">
                    <li onClick={() => navigate("/profile")}>My Profile</li>
                  </ul>
                </div>
              ) : (
                <FaUserCircle
                  className="profile-icon"
                  size={28}
                  onClick={() => navigate("/profile")}
                />
              )
            ) : (
              <button className="register-btn" onClick={() => navigate("/register")}>
                Register
              </button>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
}
