import React, { useState, useEffect } from 'react';
import './BookNow.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookNow = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');


  const navigate = useNavigate();

 useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    toast.error('You must login first!');
    navigate('/login');
  } else {
    const parsedUser = JSON.parse(storedUser);
    setUserEmail(parsedUser.email); // assuming user object has an 'email' field
  }
}, []);


  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/admin/places/${id}`);
        setPlace(response.data);
      } catch (error) {
        console.error('Error fetching place data:', error);
      }
    };

    fetchPlaceData();
  }, [id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const user = JSON.parse(localStorage.getItem('user'));

  
    if (checkOut <= checkIn) {
      toast.error('Check-out date must be after check-in date.');
      return;
    }
  
    if (!userName.trim()) {
      toast.error('Please enter your name.');
      return;
    }
  
    try {
      await axios.post('http://localhost:8000/api/admin/bookings', {
        placeId: id,
        checkInDate,
        checkOutDate,
        guests,
        userName,
        userEmail: user.email
      });
  
      setBookingConfirmed(true);
      toast.success(`Booking Confirmed for ${userName} ! Please check your email for confirmation`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message || 'The selected dates are already booked.');
        setTimeout(() => navigate('/places'), 4000); // Redirect after showing the toast
      } else {
        console.error('Booking failed:', error);
        toast.error('Booking failed. Please try again.');
      }
    }
  };
  

  if (!place) {
    return <p>Loading place details...</p>;
  }

  return (
    <section className="book-now-container">
      <div className="property-details">
        <img
          src={`http://localhost:8000/uploads/${place.image}`}
          alt="Property"
          className="property-image"
        />
        <div className="property-info">
          <h1>{place.place_name}</h1>
          <p className="property-description">{place.description}</p>
          <p className="price">₹{place.price} / night</p>
        </div>
      </div>

      {bookingConfirmed ? (
        <div className="booking-confirmation">
          <h2>Your booking has been confirmed!</h2>
          <p>Check-in: {checkInDate}</p>
          <p>Check-out: {checkOutDate}</p>
          <p>Guests: {guests}</p>
          <p>Enjoy your stay at {place.place_name}!</p>
        </div>
      ) : (
        <form className="booking-form" onSubmit={handleFormSubmit}>
          <h2>Book Your Stay</h2>

          <label htmlFor="user-name">Your Name</label>
          <input
            type="text"
            id="user-name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <label htmlFor="check-in">Check-in</label>
          <input
            type="date"
            id="check-in"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />

          <label htmlFor="check-out">Check-out</label>
          <input
            type="date"
            id="check-out"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
          />

          <label htmlFor="guests">Number of Guests</label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>
                {num} Guest{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>

          <button type="submit" className="book-now-button">Book Now</button>
        </form>
      )}
      <ToastContainer />
    </section>
  );
};

export default BookNow;
