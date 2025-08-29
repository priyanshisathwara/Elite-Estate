import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RentForm.css";

const RentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [transactionType, setTransactionType] = useState("Online");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Load logged-in user details
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

  // ✅ Fetch property details
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admin/places/${id}`)
      .then((res) => {
        setPlace(res.data);
      })
      .catch((err) => {
        console.error("Error fetching place:", err);
      });
  }, [id]);

  // ✅ Handle rent form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !startDate || !endDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/bookings",
        {
          placeId: id,
          user_name: userName,
          user_email: userEmail,
          user_phone: userPhone,
          transaction_type: transactionType,
          action_type: "Rent",
          start_date: startDate,
          end_date: endDate,
        }
      );

      toast.success("Rent request submitted successfully ✅");
      navigate(`/places`);
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to submit rent request ❌");
      }
    }
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

        <label>Transaction Type</label>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="Online">Online</option>
          <option value="Cash">Cash</option>
        </select>

        <button type="submit" className="rent-btn">
          Confirm Rent
        </button>
      </form>

      <ToastContainer />
    </section>
  );
};

export default RentForm;
