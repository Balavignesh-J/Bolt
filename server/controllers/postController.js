import imageKit from "../Configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";
import Post from "../models/Post.js";

export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files || [];
    let image_urls = [];
    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          const fileBuffer = fs.readFileSync(image.path);
          const result = await imageKit.files.upload({
            file: fileBuffer.toString("base64"),
            fileName: image.originalname,
            folder: "posts",
          });
          const url = imageKit.helper.buildSrc({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            src: result.filePath,
            transformation: [{ quality: 100, format: "webp", width: 1280 }],
          });
          return url;
        }),
      );
    }
    await Post.create({
      user: userId,
      content: content,
      image_urls,
      post_type,
    });
    res.status(201).json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeedPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    const userIds = [userId, ...user.connections, ...user.following];
    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { userId } = req.auth();
    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, message: "Post not found" });
    }
    if (post.likes_count.includes(userId)) {
      post.likes_count = post.likes_count.filter((user) => user != userId);
      await post.save();
      return res.json({ success: true, message: "Post unliked successfully" });
    } else {
      post.likes_count.push(userId);
      await post.save();
      return res.json({ success: true, message: "Post liked successfully" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
