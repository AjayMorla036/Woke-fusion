import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { validateOrder } from "./validateOrder.js";
import { sendOrderEmail as sendOrderEmailDefault } from "./mailer.js";

dotenv.config();

// sendOrderEmail is injectable so tests can verify the success and
// failure paths without making a real SMTP connection.
export function createApp({ sendOrderEmail = sendOrderEmailDefault } = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Wok Fusion order API" });
  });

  app.post("/order", async (req, res) => {
    const { valid, errors } = validateOrder(req.body);

    if (!valid) {
      res.status(400).json({ errors });
      return;
    }

    try {
      await sendOrderEmail(req.body);
      res.status(200).json({ message: "Order sent to the restaurant." });
    } catch {
      // Never leak SMTP/internal error detail, and never log the
      // customer's details - only note that a send attempt failed.
      console.error("Failed to send order email.");
      res.status(502).json({
        errors: [
          "Could not send the order right now. Please try again or call the restaurant directly.",
        ],
      });
    }
  });

  return app;
}

const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const app = createApp();
  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log(`Wok Fusion order API listening on port ${port}`);
  });
}
