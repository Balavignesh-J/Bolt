import express from "express";
import cors from "cors";
import ConnectDB from "./Configs/db.js";
import "dotenv/config";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import router from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import chatRouter from "./routes/chatRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Lazy DB connection — connects on first request, safe for Vercel serverless
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await ConnectDB();
    isConnected = true;
  }
  next();
});

app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", router);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Only listen when running locally — Vercel handles the server itself
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
