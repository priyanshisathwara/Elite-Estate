import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchUserBookings = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      try {
        // ✅ use correct API route
        const response = await axios.get(
          `http://localhost:8000/api/admin/bookings/user/${user.name}`
        );
        setBookings(response.data);
      } catch (error) {
        console.error(
          'Failed to fetch bookings:',
          error.response ? error.response.data : error.message
        );
        setBookings([]);
      } finally {
        setHasFetched(true);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div className="profile-container">
        {user ? (
          <div className="profile-details">
            <h2>Profile</h2>
            <div className="profile-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Booked Places Section */}
      <div className="booked-places">
        <h3>Booked Places</h3>
        <button onClick={fetchUserBookings}>Show Booked Places</button>

        {bookings.length > 0 ? (
          <ul className="bookings-list">
            {bookings.map((booking, index) => {
              const firstImage = booking.image
                ? booking.image   // ✅ backend already sends full URL
                : "http://localhost:8000/uploads/default.jpg";

              return (
                <li key={index} className="booking-card">
                  <img
                    src={firstImage}
                    alt={booking.place_name}
                    className="booking-image"
                  />
                  <div className="booking-details">
                    <p><strong>Booking ID:</strong> {booking.booking_id}</p>
                    <p><strong>Place Name:</strong> {booking.place_name}</p>
                    <p><strong>Action Type:</strong> {booking.action_type}</p>
                    <p><strong>Transaction Type:</strong> {booking.transaction_type}</p>
                    <p><strong>Check-in Date:</strong> {booking.start_date}</p>
                    <p><strong>Check-out Date:</strong> {booking.end_date}</p>
                    <p><strong>Price:</strong> ₹{booking.price}</p>
                    <p><strong>Booking Date:</strong> {booking.booking_date}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                  </div>
                </li>
              );
            })}

          </ul>
        ) : (
          hasFetched && <p>No bookings found.</p>
        )}
      </div>
    </>
  );
};

export default Profile;
