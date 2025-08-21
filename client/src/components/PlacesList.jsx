import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PlacesList.css";
import SearchBar from "./SearchBar";

const PlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    setUser(loggedInUser ? JSON.parse(loggedInUser) : null);

    axios
      .get("http://localhost:8000/api/admin/places")
      .then((res) => {
        setPlaces(res.data);
        setFilteredPlaces(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching places:", err);
        setError("Failed to load places");
        setLoading(false);
      });
  }, []);

  const handleSearch = (query) => {
    const filtered = places.filter((place) =>
      place.city.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  if (loading) return <h2 className="loading">Loading places...</h2>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div className="places-list-page">
      {/* Hero Section */}
      <section className="hero enhanced-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Find Your Perfect Vacation Home</h1>
            <p>Discover top-rated rentals in the most beautiful destinations!</p>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <SearchBar onSearch={handleSearch} />

      <div className="container">
        <div className="grid">
          {filteredPlaces.map((place) => (
            <div key={place.id} className="card">
              <img
                src={`http://localhost:8000/uploads/${place.image}`}
                alt={place.place_name}
                className="card-image"
              />
              <div className="card-content">
                <h3>{place.place_name}</h3>
                <p><strong>Location:</strong> {place.location}</p>
                <p><strong>City:</strong> {place.city}</p>
                <p><strong>Price:</strong> ₹{place.price}</p>
                <p className="date"><strong>Added on:</strong> {new Date(place.created_at).toLocaleDateString()}</p>
                <div className="card-buttons">
                  <Link to={`/book-now/${place.id}`} className="book-now-btn">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesList;
