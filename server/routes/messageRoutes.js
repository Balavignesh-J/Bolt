import express from "express";
import { sseController } from "../controllers/messageController";
import { upload } from "../Configs/multer";
import { protect } from "../middlewares/auth.js";

const messageRouter = express.Router();

messageRouter.get("/:userId", sseController);
messageRouter.post("/send", upload.single("image"), protect, sendMessage);
messageRouter.post("/get", protect, getChatMessage);

export default messageRouter;
