import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PlaceDetail.css";

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isBought, setIsBought] = useState(false);

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        // Fetch place details
        const res = await axios.get(`http://localhost:8000/api/admin/places/${id}`);
        const placeData = res.data;
        setPlace(placeData);

        // Parse images
        let imgs = [];
        try {
          imgs = typeof placeData.image === "string" ? JSON.parse(placeData.image) : placeData.image;
          if (!Array.isArray(imgs)) imgs = [placeData.image];
        } catch {
          if (placeData.image) imgs = [placeData.image];
        }
        if (imgs.length > 0) setSelectedImage(`http://localhost:8000/uploads/${imgs[0]}`);

        // ✅ Check if property is bought using MySQL backend
        try {
          const boughtRes = await axios.get(
            `http://localhost:8000/api/admin/bookings/${placeData.id}/checkBought`
          );
          // MySQL API returns { isBought: true/false }
          setIsBought(boughtRes.data.isBought);
        } catch (err) {
          console.warn("Failed to fetch bought status, defaulting to false", err);
          setIsBought(false); // fallback
        }

      } catch (err) {
        console.error("Error fetching place:", err);
        toast.error("Failed to fetch property details.");
        navigate("/places");
      }
    };

    fetchPlaceData();
  }, [id, navigate]);

  if (!place) return <p>Loading place details...</p>;

  // Prepare images for gallery
  const images = (() => {
    let imgs = [];
    try {
      imgs = typeof place.image === "string" ? JSON.parse(place.image) : place.image;
      if (!Array.isArray(imgs)) imgs = [place.image];
    } catch {
      if (place.image) imgs = [place.image];
    }
    return imgs;
  })();

  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/register");
      return false;
    }
    return true;
  };

  const handleAction = (actionType) => {
    if (!checkAuth()) return;

    if (actionType === "Buy" && isBought) {
      toast.error("This property has already been bought!");
      return;
    }

    navigate(`/book-now/${place.id}?action=${actionType}`);
  };

  return (
    <div className="place-container">
      <div className="left-column">
        <div className="main-image">
          {selectedImage && <img src={selectedImage} alt={place.place_name} />}
        </div>
        <div className="thumbnail-gallery">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={`http://localhost:8000/uploads/${img}`}
              alt={`${place.place_name}-${idx}`}
              onClick={() => setSelectedImage(`http://localhost:8000/uploads/${img}`)}
              className={selectedImage === `http://localhost:8000/uploads/${img}` ? "active" : ""}
            />
          ))}
        </div>
      </div>

      <div className="right-column">
        <h2 className="place-title">{place.place_name}</h2>
        <p className="place-price">₹{place.price}</p>
        <p className="place-description">{place.description}</p>

        <div className="place-info">
          <p><strong>City:</strong> {place.city}</p>
          <p><strong>Location:</strong> {place.location}</p>
          <p><strong>Property Type:</strong> {place.property_type}</p>
          <p><strong>Listing Type:</strong> {place.listing_type}</p>
          <p><strong>Bedrooms:</strong> {place.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {place.bathrooms}</p>
          <p><strong>Area:</strong> {place.area_sqft} sqft</p>
          <p><strong>Furnished:</strong> {place.furnished}</p>
          <p>
            <strong>Amenities:</strong>{" "}
            {Array.isArray(place.amenities) ? place.amenities.join(", ") : place.amenities}
          </p>
          <p><strong>Contact:</strong> {place.contact_number}</p>
          <p><strong>Owner:</strong> {place.owner_name || "N/A"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ fontWeight: "bold", color: isBought ? "red" : "green" }}>
              {isBought ? "Already Bought" : place.status}
            </span>
          </p>
          <p><strong>Created At:</strong> {new Date(place.created_at).toLocaleDateString()}</p>
        </div>

        <div className="button-group">
          <button className="rent-btn" onClick={() => handleAction("Rent")}>Rent Now</button>
          <button
            className="buy-btn"
            onClick={() => handleAction("Buy")}
            disabled={isBought}
            style={{ cursor: isBought ? "not-allowed" : "pointer" }}
          >
            {isBought ? "Already Bought" : "Buy Now"}
          </button>
          <Link to="/places" className="back-btn">Back to Places</Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PlaceDetail;
