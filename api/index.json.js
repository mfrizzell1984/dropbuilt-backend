const { shopifyApp } = require('@shopify/shopify-app-express');
const express = require('express');
const app = express();

const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_SCOPES.split(','),
    hostScheme: 'https',
    hostName: process.env.VERCEL_URL,
  },
  auth: { path: '/auth', callbackPath: '/auth/callback' },
  webhooks: { path: '/webhooks' },
});

app.use(express.json());
app.use(shopify);

app.get('/', (req, res) => {
  res.status(200).send('Dropbuilt AI Backend Running');
});

app.post('/api/generate', shopify.validateAuthenticatedSession(), async (req, res) => {
  res.status(200).json({ success: true, message: 'Theme generation queued' });
});

module.exports = app;
