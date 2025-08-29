import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./CityResult.css";

const CityResult = () => {
  const { id, city } = useParams(); // supports both
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    let apiUrl = "";

    if (id) {
      // Fetch by place ID
      apiUrl = `http://localhost:8000/api/admin/places/${id}`;
    } else if (city) {
      // Fetch by city
      apiUrl = `http://localhost:8000/api/auth/places/name/${encodeURIComponent(city)}`;
    }

    if (!apiUrl) return;

    axios
      .get(apiUrl)
      .then((res) => {
        if (id) {
          // Single place result
          setData([res.data]);
        } else if (Array.isArray(res.data)) {
          setData(res.data);
        } else if (res.data) {
          setData([res.data]);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err.response || err.message);
        setError("Failed to load details.");
        setLoading(false);
      });
  }, [id, city]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 className="error">{error}</h2>;
  if (!data || data.length === 0) return <h2>No details found.</h2>;

  return (
    <div>
      {/* Heading */}
      <div className="search-result-message">
        {id ? (
          <h1>Place Details</h1>
        ) : (
          <h1>
            Here are the results for the city <strong>{city}</strong>
          </h1>
        )}
      </div>

      {/* Display results */}
      <div className="city-container">
        {data.map((place, index) => {
          let images = [];
          try {
            images = JSON.parse(place.image);
          } catch (e) {
            console.error("Image parse error:", e);
          }

          return (
            <Link
              key={index}
              to={`/place-details/${place.id}`} // Navigate to PlaceDetails page
              className="city-card-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="city-card">
                {images.length > 0 && (
                  <img
                    src={`http://localhost:8000/uploads/${images[0]}`}
                    alt={place.place_name}
                    className="city-image"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                )}

                <div className="city-details">
                  <h1>{place.city}</h1>
                  <h2>{place.place_name}</h2>
                  <p>
                    <strong>Location:</strong> {place.location}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{place.price}
                  </p>
                  <p className="date">
                    Added on: {new Date(place.created_at).toLocaleDateString()}
                  </p>

                  {/* Button Container */}
                  <div className="card-buttons">
                    <Link to={`/book-now/${place.id}`} className="book-now-btn">
                      Book Now
                    </Link>

                    {user && user.role === "owner" && (
                      <Link
                        to={`/update-place/${place.id}`}
                        className="update-place-btn"
                      >
                        Update Place
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CityResult;
