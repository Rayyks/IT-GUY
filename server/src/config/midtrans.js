import midtransClient from "midtrans-client";

const midtrans = new midtransClient.Snap({
  isProduction: false, // Set to true for live payments
  serverKey: process.env.MIDTRANS_SERVER_KEY, // Store in .env
  clientKey: process.env.MIDTRANS_CLIENT_KEY, // Store in .env
});

export default midtrans;
