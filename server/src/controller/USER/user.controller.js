import { getUserProfile } from "./getProfile.controller.js";
import { updateUserProfile } from "./updateProfile.controller.js";
import { logoutUser } from "./logout.controller.js";
import {
  getUserNotifications,
  markNotificationsAsRead,
  deleteNotification,
} from "./notification.controller.js";
import { getUserFixHistory } from "./getFixHistory.controller.js";

export {
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUserNotifications,
  markNotificationsAsRead,
  getUserFixHistory,
  deleteNotification,
};
