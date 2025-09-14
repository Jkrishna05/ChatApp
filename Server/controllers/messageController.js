import cloudinary from "../config/cloudnary.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";
import { io, onlineUsers } from "../server.js";

// Get information for sidebar
let getuserforsidebar = async (req, res) => {
  try {
    let filterusers = await userModel.find({ _id: { $ne: req.userId } }).lean();

    let unseenmsg = {};
    let promises = filterusers.map(async (user) => {
      let messages = await messageModel.find({
        senderId: user._id,
        reciverId: req.userId,
        seen: false
      });
      if (messages.length > 0) {
        unseenmsg[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.json({ success: true, users: filterusers, unseenmsg });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages for selected user
let loadmessage = async (req, res) => {
  try {
    let myid = req.userId;
    let { id: selecteduserId } = req.params;

    let message = await messageModel.find({
      $or: [
        { senderId: selecteduserId, reciverId: myid },
        { senderId: myid, reciverId: selecteduserId }
      ]
    }).sort({ createdAt: 1 }); // keep messages in order

    await messageModel.updateMany(
      { senderId: selecteduserId, reciverId: myid, seen: false },
      { seen: true }
    );

    res.json({ success: true, message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark individual message seen
let messageseen = async (req, res) => {
  try {
    let { id } = req.params;
    await messageModel.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send message
let sendmessage = async (req, res) => {
  try {
    let { text, image } = req.body;
    let senderId = req.userId;
    let reciverId = req.params.id;

    // Verify receiver exists
    let receiver = await userModel.findById(reciverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: "Receiver not found" });
    }

    let imageUrl;
    if (image) {
      let uploadimg = await cloudinary.uploader.upload(image);
      imageUrl = uploadimg.secure_url;
    }
    console.log('req.userId:', req.userId);
console.log('req.body:', req.body);
console.log('req.params:', req.params);

    let newmessage = await messageModel.create({
      senderId,
      reciverId,
      text,
      image: imageUrl
    });

    // Emit to receiver
    let reciverSocketId = onlineUsers[reciverId];
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newmessage);
    }

    res.json({ success: true, message: newmessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { messageseen, loadmessage, getuserforsidebar, sendmessage };
