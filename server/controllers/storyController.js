import imageKit from "../Configs/imageKit.js";
import fs from "fs";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { inngest } from "../inngest/index.js";

export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = "";
    if (media_type === "image" || media_type === "video") {
      const fileBuffer = fs.readFileSync(media.path);
      const result = await imageKit.files.upload({
        file: fileBuffer.toString("base64"),
        fileName: media.originalname,
      });
      media_url = imageKit.helper.buildSrc({
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        src: result.filePath,
        transformation: [{ quality: 100, format: "webp", width: 1280 }],
      });
    }
    await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });
    await inngest.send({
      name: "app/story.delete",
      data: {
        storyId: story._id,
      },
    });
    return res.json({ success: true, message: "Story added successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    const userIds = [userId, ...user.connections, ...user.following];
    const stories = await Story.find({
      user: { $in: userIds },
    })
      .populate("user")
      .sort({ createdAt: -1 });
    return res.json({ success: true, stories });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
