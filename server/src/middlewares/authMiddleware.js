import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { errorResponse } from "../utils/responseHandler.js";
import { isTokenBlacklisted } from "../utils/tokenBlacklist.js";

/**
 * @desc Protect routes & verify JWT
 */
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return errorResponse(res, { message: "Not authorized, no token" }, 401);
  }

  if (isTokenBlacklisted(token)) {
    return errorResponse(
      res,
      { message: "Token is blacklisted. Please log in again." },
      403
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return errorResponse(res, { message: "Not authorized, token failed" }, 401);
  }
};

/**
 * @desc Restrict access to only Admins or Techs
 */
export const adminOrTech = async (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "tech")) {
    return errorResponse(
      res,
      { message: "Access denied. Admin or Tech only." },
      403
    );
  }
  next();
};
