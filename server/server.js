import express from "express";
import cors from "cors";
import ConnectDB from "./Configs/db.js";
import "dotenv/config";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import router from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import postRouter from "./routes/postRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
await ConnectDB();
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", router);
app.use("/api/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
