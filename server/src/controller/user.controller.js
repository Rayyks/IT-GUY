import User from "../models/User.js";
import Booking from "../models/booking.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { blacklistToken } from "../utils/tokenBlacklist.js";

/**
 * @desc Get User Profile
 * @route GET /api/user/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return errorResponse(res, { message: "User not found" }, 404);
    }
    return successResponse(res, user, "User profile fetched successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Logout User (Blacklist Token)
 * @route POST /api/user/logout
 * @access Private
 */
export const logoutUser = async (req, res) => {
  try {
    // Blacklist the token to prevent reuse
    blacklistToken(req.token);
    return successResponse(res, null, "User logged out successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Update User Profile
 * @route PUT /api/user/update
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, location } = req.body;

    // Prevent email change without verification (for future implementation)
    if (email && email !== req.user.email) {
      return errorResponse(
        res,
        { message: "Email update requires verification" },
        400
      );
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, location },
      { new: true }
    );

    return successResponse(res, updatedUser, "Profile updated successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Get User Fix History (Ongoing & Past Repairs)
 * @route GET /api/user/fix-history
 * @access Private
 */
export const getUserFixHistory = async (req, res) => {
  try {
    const fixHistory = await Booking.find({ userId: req.user.id });

    return successResponse(
      res,
      fixHistory,
      "Fix history retrieved successfully"
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Get Booking & Delivery Status
 * @route GET /api/user/fix-status/:bookingId
 * @access Private
 */
export const getFixStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
    });

    if (!booking) {
      return errorResponse(res, { message: "Booking not found" }, 404);
    }

    return successResponse(
      res,
      booking,
      "Booking status retrieved successfully"
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
