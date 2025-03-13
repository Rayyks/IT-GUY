import Booking from "../models/booking.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { generateUniqueId } from "../utils/generateUniqueId.js";
import { getImageUrl } from "../utils/fileUpload.js";

/**
 * @desc Create a new booking
 * @route POST /api/booking
 * @access Private (User)
 */
export const createBooking = async (req, res) => {
  try {
    const {
      category,
      subject,
      description,
      method,
      scheduleDate,
      deliveryMethod,
    } = req.body;

    console.log("📩 Incoming Request Body:", req.body);

    if (!category || !subject || !description || !method || !scheduleDate) {
      return errorResponse(
        res,
        { message: "All required fields must be filled" },
        400
      );
    }

    if (method === "drop-off" && !deliveryMethod) {
      return errorResponse(
        res,
        { message: "Delivery method is required for drop-off" },
        400
      );
    }

    const bookingId = generateUniqueId("BOOKING");
    const imageUrl = getImageUrl(req.file);

    const newBooking = await Booking.create({
      bookingId,
      userId: req.user._id,
      category,
      subject,
      description,
      method,
      scheduleDate,
      deliveryMethod: method === "drop-off" ? deliveryMethod : null,
      image: imageUrl,
    });

    console.log("✅ Booking Created:", newBooking);

    return successResponse(
      res,
      newBooking,
      "Booking created successfully",
      201
    );
  } catch (error) {
    console.error("❌ Error Creating Booking:", error);
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Get all bookings for the logged-in user
 * @route GET /api/booking
 * @access Private (User)
 */
export const getUserBookings = async (req, res) => {
  try {
    console.log("🔍 Fetching bookings for user:", req.user._id);

    const bookings = await Booking.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    console.log("📂 Retrieved Bookings:", bookings);

    return successResponse(
      res,
      bookings,
      "User bookings retrieved successfully"
    );
  } catch (error) {
    console.error("❌ Error Fetching User Bookings:", error);
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Get a single booking by ID
 * @route GET /api/booking/:id
 * @access Private (User/Admin/Tech)
 */
export const getBookingById = async (req, res) => {
  try {
    console.log("🔎 Searching for booking:", req.params.id);
    console.log("👤 Request User:", req.user);

    const query = { bookingId: req.params.id };

    // Allow only users to see their own bookings, but admins/tech can access all
    if (req.user.role !== "admin" && req.user.role !== "tech") {
      query.userId = req.user._id;
    }

    const booking = await Booking.findOne(query).populate(
      "userId",
      "username email"
    );

    if (!booking) {
      console.warn("⚠️ Booking Not Found:", req.params.id);
      return errorResponse(res, { message: "Booking not found" }, 404);
    }

    console.log("✅ Booking Found:", booking);
    return successResponse(
      res,
      booking,
      "Booking details retrieved successfully"
    );
  } catch (error) {
    console.error("❌ Error Fetching Booking:", error);
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Cancel a booking
 * @route PUT /api/booking/:id/cancel
 * @access Private (User)
 */
export const cancelBooking = async (req, res) => {
  try {
    console.log("⛔ Cancelling booking:", req.params.id);

    const { cancelReason } = req.body;
    const booking = await Booking.findOne({
      bookingId: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return errorResponse(res, { message: "Booking not found" }, 404);
    }

    if (booking.status !== "pending") {
      return errorResponse(
        res,
        { message: "Only pending bookings can be cancelled" },
        400
      );
    }

    booking.status = "cancelled";
    booking.cancelReason = cancelReason || "No reason provided";
    await booking.save();

    console.log("✅ Booking Cancelled:", booking);
    return successResponse(res, booking, "Booking cancelled successfully");
  } catch (error) {
    console.error("❌ Error Cancelling Booking:", error);
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Update booking status (Admin/Tech only)
 * @route PUT /api/booking/:id/status
 * @access Private (Admin/Tech)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    console.log("🔄 Updating Booking Status:", req.params.id);

    const { status } = req.body;
    const validStatuses = ["pending", "in-progress", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return errorResponse(res, { message: "Invalid status update" }, 400);
    }

    const booking = await Booking.findOne({ bookingId: req.params.id });

    if (!booking) {
      return errorResponse(res, { message: "Booking not found" }, 404);
    }

    booking.status = status;
    await booking.save();

    console.log("✅ Booking Status Updated:", booking);
    return successResponse(res, booking, "Booking status updated successfully");
  } catch (error) {
    console.error("❌ Error Updating Booking Status:", error);
    return errorResponse(res, error, 500);
  }
};
