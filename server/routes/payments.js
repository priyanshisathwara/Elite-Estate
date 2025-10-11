// backend/routes/payments.js
import express from "express";
import Stripe from "stripe";
import db from "../config/db.js"; // Your MySQL pool
import { fetchPlaceById, checkIfBought } from "../controllers/adminController.js";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------------------
// CREATE STRIPE PAYMENT INTENT
// ----------------------------
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { placeId, userId } = req.body;

    if (!placeId || !userId)
      return res.status(400).json({ error: "placeId and userId are required" });

    const place = await fetchPlaceById(placeId);
    if (!place) return res.status(404).json({ error: "Place not found" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(place.price * 100), // Convert INR to paise
      currency: "inr",
      metadata: { placeId, userId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// MARK PLACE AS BOUGHT/RENTED
// ----------------------------
router.post("/mark-bought", async (req, res) => {
  try {
    const { placeId, userDetails, paymentDetails } = req.body;
    const {
      user_name,
      user_email,
      user_phone,
      action_type,
      start_date,
      end_date,
    } = userDetails;

    // ✅ Validate required data
    if (!placeId || !userDetails || !paymentDetails) {
      return res.status(400).json({ error: "Missing required data" });
    }

    // 🛑 Check if already booked
    const alreadyBooked = await checkIfBought(Number(placeId));
    if (alreadyBooked)
      return res.status(400).json({ error: "Property already booked" });

    // 📅 Convert date safely
    const safeStartDate = start_date ? new Date(start_date) : null;
    const safeEndDate = end_date ? new Date(end_date) : null;

    const paymentIntentId =
      typeof paymentDetails.paymentIntentId === "string"
        ? paymentDetails.paymentIntentId
        : paymentDetails.paymentIntentId?.id || null;

    // 🪄 Step 1: Insert booking details into bookings table
    const insertSql = `
      INSERT INTO bookings
      (place_id, user_name, user_email, user_phone, action_type, start_date, end_date, status, payment_intent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)
    `;

    await db.query(insertSql, [
      placeId,
      user_name || null,
      user_email || null,
      user_phone || null,
      action_type, // default if missing
      safeStartDate,
      safeEndDate,
      paymentIntentId,
    ]);

    // 🪄 Step 2: Update place status only
    if (action_type === "Buy") {
      await db.query("UPDATE places SET status = 'Bought' WHERE id = ?", [
        placeId,
      ]);
    } else if (action_type === "Rent") {
      await db.query("UPDATE places SET status = 'Rented' WHERE id = ?", [
        placeId,
      ]);
    }

    // ✅ Send success response
    res.json({
      ok: true,
      message: `${action_type} confirmed successfully.`,
    });
  } catch (err) {
    console.error("Error in /mark-bought:", err);
    res
      .status(500)
      .json({ error: "Failed to mark place as bought or rented." });
  }
});




// ----------------------------
// CREATE STRIPE CHECKOUT SESSION
// ----------------------------
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { placeId, userId } = req.body;
    if (!placeId || !userId) return res.status(400).json({ error: "Missing placeId or userId" });

    const place = await fetchPlaceById(placeId);
    if (!place) return res.status(404).json({ error: "Place not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: place.title || place.name || `Booking: ${placeId}`,
              description: place.shortDescription || "Booking for property",
            },
            unit_amount: Math.round((place.price || 0) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&placeId=${placeId}&userId=${userId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    res.status(500).json({ error: "Server error creating session", details: err.message });
  }
});

// ----------------------------
// VERIFY CHECKOUT SESSION & SAVE BOOKING
// ----------------------------
router.get("/verify-session", async (req, res) => {
  try {
    const {
      sessionId,
      placeId,
      userName,
      userEmail,
      userPhone,
      actionType,
      startDate,
      endDate,
    } = req.query;

    if (!sessionId || !placeId) return res.status(400).json({ error: "Missing sessionId or placeId" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") return res.json({ ok: false });

    // Prepare safe values
    const safeStartDate = startDate ? new Date(startDate) : null;
    const safeEndDate = endDate ? new Date(endDate) : null;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null;

    const insertSql = `
      INSERT INTO bookings
      (place_id, user_name, user_email, user_phone, action_type, start_date, end_date, status, payment_intent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)
    `;

    db.query(
      insertSql,
      [
        placeId,
        userName || null,
        userEmail || null,
        userPhone || null,
        actionType || "Buy",
        safeStartDate,
        safeEndDate,
        paymentIntentId,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting booking:", err);
          return res.status(500).json({ error: "Failed to save booking" });
        }
        res.json({ ok: true, bookingId: result.insertId });
      }
    );
  } catch (err) {
    console.error("Error verifying session:", err);
    res.status(500).json({ error: "Error verifying session", details: err.message });
  }
});

export default router;
