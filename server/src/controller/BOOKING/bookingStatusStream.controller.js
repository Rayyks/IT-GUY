import Booking from "../../models/booking.js";

export const bookingStatusStream = async (req, res) => {
  try {
    const { id } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log(`📡 Client connected for booking updates: ${id}`);

    const sendUpdate = async () => {
      const booking = await Booking.findById(id);
      if (!booking) {
        res.write(
          `data: ${JSON.stringify({ error: "Booking not found" })}\n\n`
        );
        return;
      }
      res.write(`data: ${JSON.stringify({ status: booking.status })}\n\n`);
    };

    await sendUpdate();
    const interval = setInterval(sendUpdate, 5000); // Updates every 5 sec

    req.on("close", () => {
      console.log(`❌ Client disconnected from booking updates: ${id}`);
      clearInterval(interval);
      res.end();
    });
  } catch (error) {
    console.error("❌ Error in SSE:", error);
    res.end();
  }
};
