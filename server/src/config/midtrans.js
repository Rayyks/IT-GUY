import midtransClient from "midtrans-client";
import dotenv from "dotenv";
dotenv.config();

export const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

if (!MIDTRANS_SERVER_KEY) {
  throw new Error("MIDTRANS_SERVER_KEY is missing in .env");
}

export const midtrans = new midtransClient.Snap({
  isProduction: false, // Ganti `true` kalau udah live
  serverKey: MIDTRANS_SERVER_KEY,
});
