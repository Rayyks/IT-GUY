import Settings from "../../models/settings.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

export const updateMaxDailyBookings = async (req, res) => {
  try {
    const { day, maxBookings } = req.body;

    if (day === undefined || maxBookings === undefined) {
      return errorResponse(
        res,
        { message: "Day and maxBookings are required" },
        400
      );
    }

    if (day < 0 || day > 6) {
      return errorResponse(
        res,
        { message: "Invalid day. Must be between 0 (Sunday) and 6 (Saturday)" },
        400
      );
    }

    if (maxBookings < 1) {
      return errorResponse(
        res,
        { message: "maxBookings must be at least 1" },
        400
      );
    }

    let config = await Settings.findOne();

    if (!config) {
      config = new Settings({ maxDailyBookings: {} });
    }

    if (!config.maxDailyBookings) {
      config.maxDailyBookings = {};
    }

    config.maxDailyBookings.set(day.toString(), maxBookings);
    await config.save();

    return successResponse(
      res,
      { maxDailyBookings: config.maxDailyBookings },
      "Max daily bookings updated successfully"
    );
  } catch (error) {
    console.error("❌ Error Updating Max Daily Bookings:", error);
    return errorResponse(res, error, 500);
  }
};
