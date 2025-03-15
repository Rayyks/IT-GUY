import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  maxDailyBookings: {
    type: Map,
    of: Number,
    default: { 0: 3, 1: 5, 2: 5, 3: 5, 4: 5, 5: 3, 6: 3 },
  },
});

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
