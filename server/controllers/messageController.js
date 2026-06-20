// controllers/messageController.js
import imageKit from "../Configs/imageKit.js";
import messageModel from "../models/Message.js";
import fs from "fs";

let connections = {}; // SSE clients

// SSE connection
export const sseController = (req, res) => {
  const { userId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  connections[userId] = res;
  res.write("log: Connected\n\n");

  req.on("close", () => delete connections[userId]);
};

export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image = req.file;
    let media_url = "";
    let message_type = image ? "image" : "text";

    if (message_type === "image") {
      const fileBuffer = fs.readFileSync(image.path);
      const result = await imageKit.files.upload({
        file: fileBuffer.toString("base64"),
        fileName: image.originalname,
      });
      media_url = imageKit.helper.buildSrc({
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        src: result.filePath,
        transformation: [{ quality: 100, format: "webp", width: 1280 }],
      });
    }

    const message = await messageModel.create({
      from_user_id: userId,
      to_user_id: to_user_id,
      text,
      message_type,
      media_url,
    });

    res.json({ success: true, message });
    const messageWithUserData = await messageModel
      .findById(message._id)
      .populate("from_user_id");
    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`,
      );
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getChatMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;
    const messages = await messageModel
      .find({
        $or: [
          { from_user_id: userId, to_user_id },
          { from_user_id: to_user_id, to_user_id: userId },
        ],
      })
      .sort({ createdAt: -1 })
      .populate("from_user_id");
    if (!messages) {
      return res.json({ success: false, message: "No messages found" });
    }
    await messageModel.updateMany(
      { from_user_id: to_user_id, to_user_id: userId },
      { seen: true },
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const messages = await messageModel
      .find({ to_user_id: userId })
      .populate("from_user_id to_user_id")
      .sort({ createdAt: -1 });
    if (!messages) {
      return res.json({ success: false, message: "No messages found" });
    }
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
