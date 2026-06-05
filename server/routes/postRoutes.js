import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addPost,
  getFeedPost,
  likePost,
} from "../controllers/postController.js";
import { upload } from "../Configs/multer.js";
const postRouter = express.Router();

postRouter.post("/add", upload.array("images", 4), protect, addPost);
postRouter.get("/feed", protect, getFeedPost);
postRouter.post("/like", protect, likePost);

export default postRouter;
