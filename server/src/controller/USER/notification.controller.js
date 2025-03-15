import mongoose from "mongoose";
import Notification from "../../models/notification.js";

export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid userId:", userId);
      return res.status(400).json({ message: "Invalid user ID" });
    }

    console.log("🔍 Fetching notifications for userId:", userId);

    const notifications = await Notification.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ read: 1, createdAt: -1 })
      .lean();

    if (!notifications.length) {
      console.log("⚠️ No notifications found for this user.");
    }

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Notification.updateMany({ userId, read: false }, { read: true });

    setTimeout(async () => {
      await Notification.deleteMany({ userId, read: true });
      console.log(`🗑️ Deleted read notifications for user ${userId}`);
    }, 10 * 60 * 1000);

    return res.status(200).json({
      message: "Notifications marked as read. Will be deleted in 10 minutes.",
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const deleted = await Notification.findByIdAndDelete(notificationId);
    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
