import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./PlaceDetail.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admin/places/${id}`)
      .then((res) => {
        setPlace(res.data);

        let imgs = [];
        try {
          if (typeof res.data.image === "string") {
            imgs = JSON.parse(res.data.image);
          }
          if (!Array.isArray(imgs)) {
            imgs = [res.data.image];
          }
        } catch (e) {
          console.error("Image parse error:", e);
          if (res.data.image) {
            imgs = [res.data.image];
          }
        }

        if (imgs.length > 0) {
          setSelectedImage(`http://localhost:8000/uploads/${imgs[0]}`);
        }
      })
      .catch((err) => {
        console.error("Error fetching place:", err);
      });
  }, [id]);

  if (!place) return <p>Loading place details...</p>;

  let images = [];
  try {
    if (typeof place.image === "string") {
      images = JSON.parse(place.image);
    }
    if (!Array.isArray(images)) {
      images = [place.image];
    }
  } catch (e) {
    console.error("Image parse error:", e);
    if (place.image) {
      images = [place.image];
    }
  }

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
    // 👇 navigate with query param
    navigate(`/book-now/${place.id}?action=${actionType}`);
  };

  return (
    <div className="place-container">
      {/* Left column - image gallery */}
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
              onClick={() =>
                setSelectedImage(`http://localhost:8000/uploads/${img}`)
              }
              className={
                selectedImage === `http://localhost:8000/uploads/${img}`
                  ? "active"
                  : ""
              }
            />
          ))}
        </div>
      </div>

      {/* Right column - place details */}
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
          <p><strong>Amenities:</strong> {Array.isArray(place.amenities) ? place.amenities.join(", ") : place.amenities}</p>
          <p><strong>Contact:</strong> {place.contact_number}</p>
          <p><strong>Owner:</strong> {place.owner_name || "N/A"}</p>
          <p><strong>Created At:</strong> {new Date(place.created_at).toLocaleDateString()}</p>
        </div>

        <div className="button-group">
          <button className="rent-btn" onClick={() => navigate(`/rent/${place.id}`)}>
            Rent Now
          </button>

          <button className="buy-btn" onClick={() => handleAction("Buy")}>
            Buy Now
          </button>
          <Link to="/places" className="back-btn">
            Back to Places
          </Link>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PlaceDetail;
