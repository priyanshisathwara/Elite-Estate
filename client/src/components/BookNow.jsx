import React, { useState, useEffect } from "react";
import "./BookNow.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingStartDate, setBookingStartDate] = useState("");
  const [bookingEndDate, setBookingEndDate] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [transactionType, setTransactionType] = useState("Online");
  const [searchParams] = useSearchParams();
  const actionType = searchParams.get("action") || "Rent";

  // Fetch place data
  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/admin/places/${id}`);
        let placeData = res.data;

        // Handle images
        if (typeof placeData.image === "string") {
          try {
            const parsed = JSON.parse(placeData.image);
            placeData.images = Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            placeData.images = [placeData.image];
          }
        } else if (Array.isArray(placeData.image)) {
          placeData.images = placeData.image;
        } else {
          placeData.images = [];
        }

        setPlace(placeData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch property details.");
        navigate("/places");
      }
    };

    fetchPlaceData();
  }, [id, navigate]);

  // Fetch bookings for this place
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admin/bookings/${id}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Check user login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("You must login first!");
      navigate("/login");
    } else {
      setUserEmail(JSON.parse(storedUser).email);
    }
  }, [navigate]);

  // Check if date range is already booked
  const isDateRangeBooked = (start, end) => {
    if (!start || !end) return false;
    const startDate = new Date(start);
    const endDate = new Date(end);

    return bookings.some((b) => {
      const bookedStart = new Date(b.startDate || b.start_date);
      const bookedEnd = new Date(b.endDate || b.end_date);
      return startDate <= bookedEnd && endDate >= bookedStart; // overlap check
    });
  };

  // Calculate total days
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // include both start & end day
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (!bookingStartDate || !bookingEndDate) {
      toast.error("Please select start and end dates.");
      return;
    }

    if (isDateRangeBooked(bookingStartDate, bookingEndDate)) {
      toast.error("Selected dates are already booked. Please choose another period.");
      return;
    }

    if (!userName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    const totalDays = calculateDays(bookingStartDate, bookingEndDate);
    const totalPrice = (place?.price || 0) * totalDays;

    const qs = new URLSearchParams({
      action: actionType,
      transaction: transactionType,
      userEmail: userEmail,
      userName: userName,
      userPhone: userPhone,
      price: totalPrice.toString(),
      startDate: bookingStartDate,
      endDate: bookingEndDate,
    }).toString();

    navigate(`/payment/${id}?${qs}`);
  };

  if (!place) return <p>Loading place details...</p>;

  const totalDays = calculateDays(bookingStartDate, bookingEndDate);
  const totalPrice = (place?.price || 0) * totalDays;

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
        <h2>{actionType === "Rent" ? "Book Your Stay" : "Buy This Property"}</h2>

        <label>Your Name</label>
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />

        <label>Your Email</label>
        <input type="email" value={userEmail} readOnly />

        <label>Your Phone (Optional)</label>
        <input type="text" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />

        <label>Transaction Type</label>
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
          <option value="Online">Online</option>
          <option value="Cash">Cash</option>
        </select>

        {actionType === "Rent" && (
          <>
            <label>Start Date</label>
            <input type="date" value={bookingStartDate} onChange={(e) => setBookingStartDate(e.target.value)} />

            <label>End Date</label>
            <input type="date" value={bookingEndDate} onChange={(e) => setBookingEndDate(e.target.value)} />

            {totalDays > 0 && (
              <p style={{ fontWeight: "bold", marginTop: "10px", color: "black" }}>
                Total Price for {totalDays} {totalDays === 1 ? "day" : "days"}: ₹{totalPrice}
              </p>
            )}
          </>
        )}

        <button
          type="button"
          className="book-now-button"
          onClick={handleProceedToPayment}
          disabled={!bookingStartDate || !bookingEndDate || isDateRangeBooked(bookingStartDate, bookingEndDate)}
        >
          {isDateRangeBooked(bookingStartDate, bookingEndDate) ? "Dates Not Available" : "Proceed to Payment"}
        </button>
      </form>

      <ToastContainer />
    </section>
  );
};

export default BookNow;
