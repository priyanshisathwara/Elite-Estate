import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PlacesList.css";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const PlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
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
      <Navbar />
      {/* Hero Section */}
      <section className="hero enhanced-hero">
        <div className="hero-overlay">
        </div>
      </section>

      {/* Search Bar Section */}
      <SearchBar onSearch={handleSearch} />
      {console.log(places)}
      <div className="container">
        <div className="grid">
          {filteredPlaces.map((place) => {
            let images = [];
            try {
              images = JSON.parse(place.image); // convert string → array
            } catch (e) {
              console.error("Image parse error:", e);
            }

            return (
              <div key={place.id} className="card">
                {/* Display image */}
                {images.length > 0 && (
                  <img
                    src={`http://localhost:8000/uploads/${images[0]}`}
                    alt={place.place_name}
                    className="card-image"
                  />
                )}

                {/* Card content */}
                <div className="card-content">
                  <h3>{place.place_name}</h3>
                  <p>
                    <strong>City:</strong> {place.city}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{place.price}
                  </p>
                  <p>
                    <strong>Property Type:</strong> {place.property_type || "N/A"}
                  </p>
                  <p>
                    <strong>Listing Type:</strong> {place.listing_type || "N/A"}
                  </p>
                </div>

                {/* Button for navigation */}
                <div className="card-buttons">
                  <button
                    className="book-now-btn"
                    onClick={() => navigate(`/placedetails/${place.id}`)}
                  >
                    View More
                  </button>
                </div>
              </div>

            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlacesList;
