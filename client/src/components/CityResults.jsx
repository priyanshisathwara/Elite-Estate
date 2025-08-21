import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./CityResult.css";

const CityResult = () => {
    const { city } = useParams(); // Only use city from params
    const [cityData, setCityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Simulate user data, for example fetching it from localStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user')); // Assume the user data is saved in localStorage
        setUser(storedUser); // Set the user data (replace this with your actual user context or state fetching logic)

        console.log("Fetching data for city:", city); // Log city name

        const apiUrl = `http://localhost:8000/api/auth/places/name/${encodeURIComponent(city)}`;

        axios.get(apiUrl)
            .then((res) => {
                console.log("API Response:", res.data);
                if (Array.isArray(res.data)) {
                    setCityData(res.data);
                } else if (res.data) {
                    setCityData([res.data]);
                } else {
                    setCityData([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching city data:", err.response || err.message);
                setError("Failed to load city details.");
                setLoading(false);
            });
    }, [city]);

    console.log("City parameter in API call:", city);

    if (loading) return <h2>Loading city details...</h2>;
    if (error) return <h2 className="error">{error}</h2>;
    if (!cityData || cityData.length === 0) return <h2>No details found for this city.</h2>;

    return (
        <div>
            {/* Message showing the search results for the city */}
            <div className="search-result-message">
                <h1>Here are the results for the city <strong>{city}</strong></h1>
            </div>

            {/* City Cards Display */}
            <div className="city-container">
                {cityData.map((place, index) => (
                    <div key={index} className="city-card">
                        <img
                            src={`http://localhost:8000/uploads/${place.image}`}
                            alt={place.place_name}
                            className="city-image"
                            onError={(e) => e.target.src = "/default-image.jpg"}
                        />
                        <div className="city-details">
                            <h1>{place.city}</h1>
                            <h2>{place.place_name}</h2>
                            <p><strong>Location:</strong> {place.location}</p>
                            <p><strong>Price:</strong> ₹{place.price}</p>
                            <p className="date">
                                Added on: {new Date(place.created_at).toLocaleDateString()}
                            </p>

                            {/* Button Container */}
                            <div className="card-buttons">
                                <Link to={`/book-now/${place.id}`} className="book-now-btn">
                                    Book Now
                                </Link>

                                {/* Conditional Rendering for Owner */}
                                {user && user.role === "owner" && (
                                    <Link to={`/update-place/${place.id}`} className="update-place-btn">
                                        Update Place
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CityResult;
