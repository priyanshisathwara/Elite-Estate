// backend/webhook.js
import express from "express";
import Stripe from "stripe";
import bodyParser from "body-parser";

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // You can use metadata or client_reference_id to identify place/user
    // Example:
    // await markPlaceAsBought(session.client_reference_id, ...);

    console.log("✅ Checkout session completed:", session.id);
  }

  res.json({ received: true });
});

export default router;
