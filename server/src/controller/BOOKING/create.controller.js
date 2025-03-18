import Booking from "../../models/booking.js";
import Payment from "../../models/payment.js";
import Settings from "../../models/settings.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { generateUniqueId } from "../../utils/generateUniqueId.js";
import { getImageUrl } from "../../utils/fileUpload.js";
import { formatIndonesianDate } from "../../utils/formatIndonesianDate.js";
import { sendAdminBookingNotification } from "../../utils/emailService.js";

export const createBooking = async (req, res) => {
  try {
    const {
      category,
      subject,
      description,
      method,
      scheduleDate,
      deliveryMethod,
      pickupMethod,
      clientLocation,
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

    if (method === "pickup" && !pickupMethod) {
      return errorResponse(
        res,
        { message: "Pickup method is required for pickup." },
        400
      );
    }

    if (method === "pickup" && req.body.pickupStatus) {
      return errorResponse(
        res,
        { message: "Pickup status should not be provided manually." },
        400
      );
    }

    if (method === "drop-off" && !deliveryMethod) {
      return errorResponse(
        res,
        { message: "Delivery method is required for drop-off." },
        400
      );
    }

    if (method !== "drop-off" && deliveryMethod) {
      return errorResponse(
        res,
        { message: "Delivery method should only be provided for drop-off." },
        400
      );
    }

    const bookingDate = new Date(scheduleDate);
    if (isNaN(bookingDate.getTime())) {
      return errorResponse(res, { message: "Invalid schedule date" }, 400);
    }

    const settings = await Settings.findOne();
    if (!settings) {
      return errorResponse(res, { message: "Settings not found" }, 500);
    }

    const dayOfWeek = bookingDate.getDay();
    const dailyLimit = settings.maxDailyBookings.get(dayOfWeek.toString()) ?? 5;

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await Booking.countDocuments({
      scheduleDate: { $gte: startOfDay, $lt: endOfDay },
    });

    if (existingBookings >= dailyLimit) {
      return errorResponse(
        res,
        {
          message: `Bookings for ${formaIndonesiantDate(
            bookingDate
          )} are full. Please select another date.`,
        },
        400
      );
    }

    // **Extract uploaded files correctly**
    let imageUrl = null;
    let videoUrl = null;

    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        imageUrl = `/uploads/${req.files.image[0].filename}`;
      }
      if (req.files.video && req.files.video.length > 0) {
        videoUrl = `/uploads/${req.files.video[0].filename}`;
      }
    }

    const bookingId = generateUniqueId("BOOKING");

    const newBooking = await Booking.create({
      bookingId,
      userId: req.user._id,
      category,
      subject,
      description,
      method,
      scheduleDate: bookingDate,
      deliveryMethod: method === "drop-off" ? deliveryMethod : null,
      pickupMethod: method === "pickup" ? pickupMethod : null,
      clientLocation:
        method === "on-site" || method === "pickup" ? clientLocation : null,
      image: imageUrl, // Store image path
      video: videoUrl, // Store video path
      paymentMethod,
      pickupStatus: method === "pickup" ? "pending" : null,
      deliveryStatus:
        method === "drop-off" && deliveryMethod === "itguy-delivery"
          ? "pending"
          : null,
      totalAmount: 0,
    });

    await sendAdminBookingNotification(newBooking);

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
      {
        booking: {
          ...newBooking.toObject(),
          scheduleDate: formatIndonesianDate(newBooking.scheduleDate),
        },
      },
      `Booking created successfully for ${formatIndonesianDate(
        newBooking.scheduleDate
      )}`,
      201
    );
  } catch (error) {
    console.error("❌ Error Creating Booking:", error);
    return errorResponse(res, error, 500);
  }
};
