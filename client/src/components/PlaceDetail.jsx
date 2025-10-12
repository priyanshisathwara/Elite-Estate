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
  const [bookings, setBookings] = useState([]);

  // Fetch place details and booking status
  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
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

        // Fetch buy status
        try {
          const statusRes = await axios.get(
            `http://localhost:8000/api/admin/bookings/${placeData.id}/checkBought`
          );
          setIsBought(statusRes.data.bought);
        } catch (err) {
          console.warn("Failed to fetch buy status, defaulting to false", err);
          setIsBought(false);
        }

      } catch (err) {
        console.error("Error fetching place:", err);
        toast.error("Failed to fetch property details.");
        navigate("/places");
      }
    };

    fetchPlaceData();
  }, [id, navigate]);

  // Fetch all bookings for this place
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/admin/bookings/${id}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [id]);

  // Function to check if a date range is booked
  // Function to check if a date range is booked
  const isDateRangeBooked = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return bookings.some(b => {
      const bookedStart = new Date(b.start_date || b.startDate);
      const bookedEnd = new Date(b.end_date || b.endDate);

      // Check if ranges overlap
      return startDate <= bookedEnd && endDate >= bookedStart;
    });
  };

  const getLatestBookingEndDate = () => {
    if (bookings.length === 0) return null;

    // Get the latest end_date
    const latestBooking = bookings.reduce((latest, current) => {
      const latestEnd = new Date(latest.endDate || latest.end_date);
      const currentEnd = new Date(current.endDate || current.end_date);
      return currentEnd > latestEnd ? current : latest;
    });

    return new Date(latestBooking.endDate || latestBooking.end_date);
  };


  // Check if property is currently booked
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const isCurrentlyBooked = isDateRangeBooked(today, today);

  // Auth check
  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/register");
      return false;
    }
    return true;
  };

  const handleAction = (actionType, rentStart, rentEnd) => {
  if (!checkAuth()) return;

  if (actionType === "Buy" && isBought) {
    toast.error("This property has already been bought!");
    return;
  }

  if (actionType === "Rent" && isDateRangeBooked(rentStart, rentEnd)) {
    toast.error("This property is already rented for selected dates!");
    return;
  }

  navigate(`/book-now/${place.id}?action=${actionType}`);
};

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
          <p><strong>Amenities:</strong> {Array.isArray(place.amenities) ? place.amenities.join(", ") : place.amenities}</p>
          <p><strong>Contact:</strong> {place.contact_number}</p>
          <p><strong>Owner:</strong> {place.owner_name || "N/A"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                fontWeight: "bold",
                color: isBought || isCurrentlyBooked ? "red" : "green",
              }}
            >
              {isBought
                ? "Already Bought"
                : isCurrentlyBooked
                  ? "Already Rented"
                  : place.status}
            </span>
          </p>

          <p><strong>Created At:</strong> {new Date(place.created_at).toLocaleDateString()}</p>
        </div>

        <div className="button-group">
          {place.listing_type?.toLowerCase() === "rent" && (
            <>
              <button
                className="rent-btn"
                onClick={() => handleAction("Rent")}
                disabled={isCurrentlyBooked || isBought}
                style={{ cursor: isCurrentlyBooked || isBought ? "not-allowed" : "pointer" }}
              >
                {isCurrentlyBooked ? "Currently Booked" : "Rent Now"}
              </button>

              {/* 🕒 Show availability info */}
              {isCurrentlyBooked && (
                <p style={{ marginTop: "8px", color: "red", fontWeight: "500" }}>
                  This property will be available after{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {getLatestBookingEndDate()?.toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  .
                </p>
              )}
            </>
          )}


          {place.listing_type?.toLowerCase() === "buy" && (
            <button
              className="buy-btn"
              onClick={() => handleAction("Buy")}
              disabled={isBought}
              style={{ cursor: isBought ? "not-allowed" : "pointer" }}
            >
              {isBought ? "Already Bought" : "Buy Now"}
            </button>
          )}

          <Link to="/places" className="back-btn">Back to Places</Link>
        </div>

      </div>

      <ToastContainer />
    </div>
  );
};

export default PlaceDetail;
