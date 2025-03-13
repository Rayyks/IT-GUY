import Booking from "../../models/booking.js";
import Payment from "../../models/payment.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { generateUniqueId } from "../../utils/generateUniqueId.js";
import { getImageUrl } from "../../utils/fileUpload.js";

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
      paymentMethod,
    } = req.body;

    if (
      !category ||
      !subject ||
      !description ||
      !method ||
      !scheduleDate ||
      !paymentMethod
    ) {
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

    // Handle file uploads
    const imageUrl = req.files?.image ? getImageUrl(req.files.image[0]) : null;
    const videoUrl = req.files?.video ? getImageUrl(req.files.video[0]) : null;

    // Create booking
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
      video: videoUrl,
      paymentMethod,
    });

    // ✅ Cek apakah payment sudah ada
    const existingPayment = await Payment.findOne({ booking: newBooking._id });

    if (!existingPayment) {
      await Payment.create({
        user: req.user._id,
        booking: newBooking._id,
        amount: newBooking.totalAmount,
        paymentMethod: newBooking.paymentMethod,
        status: "pending",
      });
    }

    return successResponse(
      res,
      { booking: newBooking },
      "Booking created successfully",
      201
    );
  } catch (error) {
    console.error("❌ Error Creating Booking:", error);
    return errorResponse(res, error, 500);
  }
};
