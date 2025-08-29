import React, { useState, useEffect } from 'react';
import './BookNow.css';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookNow = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const actionType = searchParams.get("action") || "Rent"; // Rent or Buy

  // Dates (only for Rent)
  const [bookingStartDate, setBookingStartDate] = useState('');
  const [bookingEndDate, setBookingEndDate] = useState('');

  // User details
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [transactionType, setTransactionType] = useState('Online'); // default

  const navigate = useNavigate();

  // Check user login
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast.error('You must login first!');
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUserEmail(parsedUser.email); // preload email from login
    }
  }, [navigate]);

  // Fetch place data
  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/places/${id}`);
        let placeData = response.data;
        try {
          placeData.images = JSON.parse(placeData.image); // string → array
        } catch (e) {
          placeData.images = [];
        }
        setPlace(placeData);
      } catch (error) {
        console.error('Error fetching place data:', error);
      }
    };
    fetchPlaceData();
  }, [id]);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
    if (!transactionType) {
      toast.error('Please select a transaction type.');
      return;
    }

    // Build request payload
    const requestData = {
      placeId: parseInt(id),
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone || null,
      transaction_type: transactionType,
      action_type: actionType,
    };

    // Add dates only for Rent
    if (actionType === "Rent") {
      if (!bookingStartDate || !bookingEndDate) {
        toast.error('Please select start and end dates.');
        return;
      }
      requestData.start_date = bookingStartDate;
      requestData.end_date = bookingEndDate;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/admin/bookings', requestData);
      console.log('Booking response:', response.data);
      setBookingConfirmed(true);
      toast.success(`Booking Request Created for ${userName}!`);
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Booking failed. Please try again.');
    }
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
          <p className="price">₹{place.price} / {actionType === "Rent" ? "night" : "one-time"}</p>
        </div>
      </div>

      {bookingConfirmed ? (
        <div className="booking-confirmation">
          <h2>Your {actionType === "Rent" ? "booking request" : "purchase request"} has been created!</h2>
          <p>Name: {userName}</p>
          <p>Email: {userEmail}</p>
          <p>Phone: {userPhone || 'N/A'}</p>
          <p>Transaction Type: {transactionType}</p>
          {actionType === "Rent" && (
            <>
              <p>Start Date: {bookingStartDate}</p>
              <p>End Date: {bookingEndDate}</p>
            </>
          )}
          <p>Our team will review and confirm it soon.</p>
        </div>
      ) : (
        <form className="booking-form" onSubmit={handleFormSubmit}>
          <h2>{actionType === "Rent" ? "Book Your Stay" : "Buy This Property"}</h2>

          <label htmlFor="user-name">Your Name</label>
          <input
            type="text"
            id="user-name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <label htmlFor="user-email">Your Email</label>
          <input type="email" id="user-email" value={userEmail} readOnly />

          <label htmlFor="user-phone">Your Phone (Optional)</label>
          <input
            type="text"
            id="user-phone"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
          />

          <label htmlFor="transaction-type">Transaction Type</label>
          <select
            id="transaction-type"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            required
          >
            <option value="Online">Online</option>
            <option value="Cash">Cash</option>
          </select>

          {/* Dates shown only for Rent */}
          {actionType === "Rent" && (
            <>
              <label htmlFor="start-date">Start Date</label>
              <input
                type="date"
                id="start-date"
                value={bookingStartDate}
                onChange={(e) => setBookingStartDate(e.target.value)}
                required
              />

              <label htmlFor="end-date">End Date</label>
              <input
                type="date"
                id="end-date"
                value={bookingEndDate}
                onChange={(e) => setBookingEndDate(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" className="book-now-button">
            {actionType === "Rent" ? "Book Now" : "Buy Now"}
          </button>
        </form>
      )}

      <ToastContainer />
    </section>
  );
};

export default BookNow;
