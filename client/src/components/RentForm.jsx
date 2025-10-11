import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RentForm.css";

const RentForm = () => {
  const { id } = useParams(); // property ID from route
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Load logged-in user info
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

  // Fetch property details
  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:8000/api/admin/places/${id}`)
      .then((res) => {
        console.log("Fetched place:", res.data);
        setPlace(res.data);
      })
      .catch((err) => {
        console.error("Error fetching place:", err);
        toast.error("Failed to load property details.");
      });
  }, [id]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!userName || !startDate || !endDate) {
    toast.error("Please fill all required fields.");
    return;
  }

  if (!place || !place.id) {
    toast.error("Property not loaded yet.");
    return;
  }

  // Include query params here
  const queryParams = new URLSearchParams({
    actionType: "Rent",
    userName,
    userEmail,
    userPhone,
    price: place.price,
    startDate,
    endDate,
  }).toString();

  // Pass both path param and query params
  navigate(`/payment/${place.id}?${queryParams}`);
};

  if (!place) return <p>Loading property details...</p>;

  return (
    <section className="rent-form-container">
      <div className="property-summary">
        <h2>{place.place_name}</h2>
        <p>{place.description}</p>
        <p>
          <strong>Price:</strong> ₹{place.price} / night
        </p>
      </div>

      <form className="rent-form" onSubmit={handleSubmit}>
        <h3>Rent This Property</h3>

        <label>Your Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label>Your Email</label>
        <input type="email" value={userEmail} readOnly />

        <label>Your Phone (Optional)</label>
        <input
          type="text"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <button type="submit" className="rent-btn">
          Proceed to Payment
        </button>
      </form>

      <ToastContainer />
    </section>
  );
};

export default RentForm;
