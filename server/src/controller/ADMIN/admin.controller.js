import { getAllBookings } from "./getAllUserBook.controller.js";
import { getUserBookById } from "./getUserBookById.controller.js";
import { updateBookingStatus } from "./updateBookingStatus.controller.js";
import { setTotalAmount } from "./setTotalAmount.controller.js";
import { cancelBooking } from "./cancelBooking.controller.js";
import { confirmPayment } from "./confirmPayment.controller.js";
import { refundPayment } from "./refundPayment.controller.js";
import { getAllUsers } from "./getAllUsers.controller.js";
import { toggleUserStatus } from "./toggleUserStatus.controller.js";
import { updateDeliveryStatus } from "./updateDeliveryStatus.controller.js";
import { updatePickupStatus } from "./updatePickupStatus.controller.js";
import { updateMaxDailyBookings } from "./updateMaxDialyBookings.controller.js";

import { registerAdmin } from "./registerAdmin.controller.js";

export {
  getAllBookings,
  getUserBookById,
  updateBookingStatus,
  setTotalAmount,
  cancelBooking,
  confirmPayment,
  refundPayment,
  getAllUsers,
  toggleUserStatus,
  registerAdmin,
  updateDeliveryStatus,
  updatePickupStatus,
  updateMaxDailyBookings,
};
