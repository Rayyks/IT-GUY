import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import cron from "node-cron";
import { formatDate } from "../../utils/formatDate.js";
import Notification from "../../models/notification.js";

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { bookingId: id };

    const booking = await Booking.findOne(query);

    if (!booking)
      return errorResponse(res, { message: "Booking not found" }, 404);

    booking.status = "cancelled";
    booking.cancelReason = cancelReason;
    await booking.save();

    // ✅ Save In-Web Notification
    await Notification.create({
      userId: booking.userId._id,
      bookingId: booking.bookingId,
      title: "Booking Cancelled by Admin 🚫",
      message: `Admin has cancelled your booking #${booking.bookingId}.`,
    });

    // Schedule a cron job to delete the booking 3 minutes after cancellation
    cron.schedule("*/3 * * * *", async () => {
      await Booking.deleteOne(query);
      console.log(`Booking with ID ${id} has been deleted.`);
    });

    return successResponse(
      res,
      { ...booking.toObject(), scheduleDate: formatDate(booking.scheduleDate) },
      "Booking cancelled successfully"
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
