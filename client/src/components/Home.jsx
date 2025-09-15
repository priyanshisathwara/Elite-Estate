import React from 'react';
import Navbar from './Navbar';
import SearchBar from './SearchBar';
import "./home.css";
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Sections from './Sections';
import ViMi from './ViMi';

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

      <SearchBar />

      <Sections />

      {/* Highlight / Stats Section */}
                  <section className="highlight">
                      <div className="highlight-box">
                          <h2>
                              “Building trust, one home at a time—because your happiness is our
                              greatest achievement.”
                          </h2>
                          <div className="stats-grid">
                              <div className="stat-item">
                                  <h3>500+</h3>
                                  <p>Premium Properties Delivered</p>
                              </div>
                              <div className="stat-item">
                                  <h3>10K+</h3>
                                  <p>Happy Families Settled</p>
                              </div>
                              <div className="stat-item">
                                  <h3>100+</h3>
                                  <p>Awards & Recognitions</p>
                              </div>
                              <div className="stat-item">
                                  <h3>20+</h3>
                                  <p>Years of Trusted Experience</p>
                              </div>
                          </div>
                      </div>
                  </section>

      <ViMi />
      
      <Footer />
    </div>
  );
};

export default Home;
