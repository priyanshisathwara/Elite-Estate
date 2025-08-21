import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import "./home.css";
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    user = null;
  }

  const isOwner = user?.role === "owner";

  const handleAddProperty = () => {
    navigate("/add-places");
  };

  const handleOwnerDashboard = () => {
    // Navigate to the Owner Dashboard page
    navigate('/owner-dashboard');
  };

  return (
    <div>
      <div className='home-container'>
        <Navbar />
        <div className="search-bar-container">
          <SearchBar />
        </div>
        <div className="home-text">
          <h3 className="fade-in">Welcome To</h3>
          <h1 className="slide-up">Elite Estate</h1>
          <p className="fade-in-delay">“Where Luxury Meets Comfort, Your Dream Home Awaits.”</p>
        </div>

      </div>

      {/* {isOwner && (
        <div className="o-add-property-card" onClick={handleAddProperty}>
          <div className="owner-card-icon">🏠</div>
          <div className="owner-card-text">Add Your Property</div>
          <div className="card-quote">"Turn your space into someone’s next dream stay!"</div>
        </div>
      )} */}

      {isOwner && (
        <div className="owner-dashboard-container">
          <button onClick={handleOwnerDashboard} className="owner-dashboard-btn">
            Go to Owner Dashboard
          </button>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Home;
