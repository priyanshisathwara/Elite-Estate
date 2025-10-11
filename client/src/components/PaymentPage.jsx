import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PaymentPage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({
  placeId,
  userEmail,
  userName,
  userPhone,
  price,
  actionType,
  startDate,
  endDate,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment intent
      const res = await axios.post("http://localhost:8000/api/payments/create-payment-intent", {
        placeId: Number(placeId),
        userId: userEmail,
      });

      const clientSecret = res.data.clientSecret;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: userName || "Guest", email: userEmail },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");

        // Mark booking as paid
        await axios.post("http://localhost:8000/api/payments/mark-bought", {
          placeId: Number(placeId),
          userDetails: {
            user_name: userName || "Guest",
            user_email: userEmail,
            user_phone: userPhone,
            action_type: actionType,
            start_date: actionType === "Rent" ? startDate : null,
            end_date: actionType === "Rent" ? endDate : null,
          },
          paymentDetails: {
            paymentIntentId: result.paymentIntent.id,
          },
        });

        toast.success(`${actionType} confirmed successfully!`);
        setTimeout(() => navigate("/places"), 2000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment or booking failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="payment-form">
      <h2>Enter Card Details</h2>
      <div className="card-element-wrapper">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay ₹${price}`}
      </button>
    </form>
  );
};

export default function PaymentPage() {
  const { placeId } = useParams(); // path param
  const [searchParams] = useSearchParams();

 const actionType = searchParams.get("action") || "Buy";
  const userName = searchParams.get("userName") || "";
  const userEmail = searchParams.get("userEmail") || "";
  const userPhone = searchParams.get("userPhone") || "";
  const price = searchParams.get("price") || "0";
  const startDate = searchParams.get("startDate") || null;
  const endDate = searchParams.get("endDate") || null;

  if (!placeId) {
    return <p>Error: Invalid property selected. Please go back and choose a property.</p>;
  }

  return (
    <div className="payment-page-container">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          placeId={placeId}
          userEmail={userEmail}
          userName={userName}
          userPhone={userPhone}
          price={price}
          actionType={actionType}
          startDate={startDate}
          endDate={endDate}
        />
      </Elements>
      <ToastContainer />
    </div>
  );
}
