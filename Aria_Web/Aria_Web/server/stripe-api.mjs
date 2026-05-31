import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 4242);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePrices = {
  pro: process.env.STRIPE_PRICE_PRO,
  elite: process.env.STRIPE_PRICE_ELITE,
};

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://127.0.0.1:5173" }));
app.use(express.json());

app.post("/api/stripe/create-checkout-session", async (req, res) => {
  const { planId, successUrl, cancelUrl } = req.body || {};
  const priceId = stripePrices[planId];

  if (!stripeSecretKey) {
    return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY." });
  }

  if (!priceId) {
    return res.status(400).json({ error: "Unknown plan or missing Stripe price id." });
  }

  if (!successUrl || !cancelUrl) {
    return res.status(400).json({ error: "Missing successUrl or cancelUrl." });
  }

  const body = new URLSearchParams({
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    allow_promotion_codes: "true",
    billing_address_collection: "auto",
    "metadata[planId]": planId,
  });

  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await stripeResponse.json();

  if (!stripeResponse.ok) {
    return res.status(stripeResponse.status).json({ error: data.error?.message || "Stripe Checkout failed." });
  }

  return res.json({ url: data.url });
});

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (_req, res) => {
  res.status(501).json({ error: "Stripe webhook persistence is not implemented yet." });
});

app.listen(port, () => {
  console.log(`Stripe API server listening on http://127.0.0.1:${port}`);
});
