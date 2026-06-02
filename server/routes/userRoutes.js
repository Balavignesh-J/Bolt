import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  discoverUsers,
  followUser,
  getUserData,
  unfollowUser,
  updateUserData,
} from "../controllers/userController.js";
import { upload } from "../Configs/multer.js";

const router = express.Router();

router.get("/data", protect, getUserData);
router.post(
  "/update",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  protect,
  updateUserData,
);
router.post("/discover", protect, discoverUsers);
router.post("/follow", protect, followUser);
router.post("/unfollow", protect, unfollowUser);

export default router;
