import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  acceptConnectionsRequest,
  discoverUsers,
  followUser,
  getUserConnections,
  getUserData,
  getUserProfiles,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
} from "../controllers/userController.js";
import { upload } from "../Configs/multer.js";
import { getUserRecentMessages } from "../controllers/messageController.js";

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
router.post("/connect", protect, sendConnectionRequest);
router.post("/accept", protect, acceptConnectionsRequest);
router.get("/connections", protect, getUserConnections);

router.post("/profiles", getUserProfiles);
router.get("/recent-messages", protect, getUserRecentMessages);

export default router;
