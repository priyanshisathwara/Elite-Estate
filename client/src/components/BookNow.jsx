// src/components/BookNow.jsx
import React, { useState, useEffect } from "react";
import "./BookNow.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookNow = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const actionType = searchParams.get("action") || "Rent";

  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [transactionType, setTransactionType] = useState("Online");

  const navigate = useNavigate();

  // Check user login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("You must login first!");
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUserEmail(parsedUser.email);
    }
  }, [navigate]);

  // Fetch place data
  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/admin/places/${id}`
        );
        let placeData = response.data;
        try {
          placeData.images = JSON.parse(placeData.image);
        } catch (e) {
          placeData.images = [];
        }
        setPlace(placeData);
      } catch (error) {
        console.error("Error fetching place data:", error);
        toast.error("Failed to fetch property details.");
        navigate("/places");
      }
    };
    fetchPlaceData();
  }, [id, navigate]);

  // New: navigate to payment page (pass minimal data via query params)
  const handleProceedToPayment = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    // Build query string (we keep it minimal; sensitive data should not go in URL)
    const qs = new URLSearchParams({
      action: actionType,
      transaction: transactionType,
      userEmail: userEmail || "",
      userName: userName || "",
      userPhone: userPhone || "",
      price: place?.price?.toString() || "0"
    }).toString();

    navigate(`/payment/${id}?${qs}`);
  };

  if (!place) return <p>Loading place details...</p>;

  return (
    <section className="book-now-container">
      <div className="property-details">
        <img
          src={
            place.images && place.images.length > 0
              ? `http://localhost:8000/uploads/${place.images[0]}`
              : "http://localhost:8000/uploads/default.jpg"
          }
          alt="Property"
          className="property-image"
        />

        <div className="property-info">
          <h1>{place.place_name}</h1>
          <p className="property-description">{place.description}</p>
          <p className="price">
            ₹{place.price} / {actionType === "Rent" ? "night" : "one-time"}
          </p>
        </div>
      </div>

      <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
        <h2>
          {actionType === "Rent" ? "Book Your Stay" : "Buy This Property"}
        </h2>

        <label>Your Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label>Your Email</label>
        <input type="email" value={userEmail} readOnly />

        <label>Your Phone (Optional)</label>
        <input
          type="text"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />

        <label>Transaction Type</label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="Online">Online</option>
          <option value="Cash">Cash</option>
        </select>

        {actionType === "Rent" && (
          <>
            <label>Start Date</label>
            <input
              type="date"
              value={bookingStartDate}
              onChange={(e) => setBookingStartDate(e.target.value)}
            />
            <label>End Date</label>
            <input
              type="date"
              value={bookingEndDate}
              onChange={(e) => setBookingEndDate(e.target.value)}
            />
          </>
        )}

        {/* NEW: Proceed to Payment button */}
        <button
          type="button"
          className="book-now-button"
          onClick={handleProceedToPayment}
        >
          {actionType === "Rent" ? "Proceed to Payment" : "Pay Now"}
        </button>
      </form>

      <ToastContainer />
    </section>
  );
};

export default BookNow;
