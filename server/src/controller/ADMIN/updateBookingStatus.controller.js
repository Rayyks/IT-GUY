import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Update booking status (Admin/Tech)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if the id is a valid ObjectId
    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const query = isObjectId ? { _id: id } : { bookingId: id };

    const booking = await Booking.findOne(query);

    if (!booking)
      return errorResponse(res, { message: "Booking not found" }, 404);

    booking.status = status;
    await booking.save();

    return successResponse(res, booking, "Booking status updated successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
