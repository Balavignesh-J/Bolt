import imageKit from "../Configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);

    !username && username === tempUser.username;

    if (tempUser.username !== username) {
      const user = await User.findOne({ username });
      if (user) {
        username = tempUser.username;
      }
    }
    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path);
      const result = await imageKit.files.upload({
        file: buffer.toString("base64"),
        fileName: profile.originalname,
      });
      updatedData.profile_picture = imageKit.helper.buildSrc({
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        src: result.filePath,
        transformation: [{ quality: 80, format: "webp", width: 512 }],
      });
    }
    if (cover) {
      const buffer = fs.readFileSync(cover.path);
      const result = await imageKit.files.upload({
        file: buffer.toString("base64"),
        fileName: cover.originalname,
      });
      const url = imageKit.helper.buildSrc({
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        src: result.filePath,
        transformation: [{ quality: 80, format: "webp", width: 1280 }],
      });
      updatedData.cover_photo = url;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user,
      message: "Profile updated Sucessfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;
    const users = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });
    const filteredUsers = users.filter((user) => user._id !== userId);
    return res.json({
      success: true,
      data: filteredUsers,
      message: "Users found successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    const user = await User.findById(userId);

    if (user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are already following this user",
      });
    }

    user.following.push(id);
    await user.save();

    const toUser = await User.findById(id);
    toUser.followers.push(userId);
    await toUser.save();

    return res.json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    const user = await User.findById(userId);

    if (!user.following.includes(id)) {
      return res.json({
        success: false,
        message: "You are not following this user",
      });
    }

    user.following.pull(id);
    await user.save();

    const toUser = await User.findById(id);
    await toUser.followers.pull(userId);
    await toUser.save();

    return res.json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    if (userId === id) {
      return res.json({
        success: false,
        message: "You cannot send a connection request to yourself",
      });
    }

    const last24hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gte: last24hours },
    });
    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message:
          "You have already sent 20 connection requests in last 24 hours",
      });
    }
    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId },
      ],
    });
    if (!connection) {
      await Connection.create({
        from_user_id: userId,
        to_user_id: id,
      });
      return res.json({
        success: true,
        message: "Connection request sent successfully",
      });
    } else if (connection && connection.status === "accepted") {
      return res.json({
        success: false,
        message: "You are already connected with this user",
      });
    }
    return res.json({
      success: true,
      message: "Connection request pending",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
