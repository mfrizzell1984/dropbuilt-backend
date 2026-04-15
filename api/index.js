import express from "express";
import { shopifyApp } from "@shopify/shopify-app-express";

const app = express();

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_SCOPES?.split(","),
    hostScheme: "https",
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
  },
});

app.use(express.json());
app.use(shopify);

app.get("/", async (req, res) => {
  const { shop } = req.query;
  if (shop) {
    res.redirect(`/api/auth?shop=${shop}`);
  } else {
    res.status(400).send("Missing shop parameter");
  }
});

app.get("/api/auth/callback", async (req, res) => {
  try {
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });
    const { session } = callbackResponse;
    console.log(`Authenticated: ${session.shop}`);
    res.redirect(`https://${session.shop}/admin/apps`);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
