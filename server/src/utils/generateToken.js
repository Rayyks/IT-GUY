import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
