import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import {hasImageKitConfig, uploadChatMedia} from "../lib/imagekit.js"
import {getRecieverSocketId, io} from "../lib/socket.js"

export async function getUsersForSidebar(req, res) {
  try {
    const loggedUser = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedUser } }).select(
      "-clerkId",
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for sidebar", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationsForSidebar(req, res) {
  try {
    const loggedUserId = req.user._id;
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedUserId }, { receiverId: loggedUserId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      {$sort: {lastMessageAt: -1}},
      {$lookup:{from: "users", localField: "_id", foreignField: "_id", as: "user"}},
      {$replaceRoot:{newRoot:{$first: "$user"}}},
      {$project: {clerkId: 0}}
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations for sidebar", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req, res) {
    try{
        const {id: userToChatId} = req.params;
        const myIf = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myIf, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myIf}
            ]
        }).sort({createdAt: 1});

        res.status(200).json(messages);

    }catch(error){
        console.error("Error fetching messages", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function sendMessage(req, res) {
    try{
        const {text} = req.body;
        const {id:recieverId} = req.params;
        const senderId = req.user._id;
         
        let imageUrl;
        let videoUrl;

        if(req.file){
            if(!hasImageKitConfig()){
                return res.status(500).json({message: "Media upload is not configured"});
            }

            const mediaUrl = await uploadChatMedia(req.file)
            if(req.file.mimetype.startsWith("image/")){
                imageUrl = mediaUrl;
            }else if(req.file.mimetype.startsWith("video/")){
                videoUrl = mediaUrl;
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId: recieverId,
            text,
            image: imageUrl,
            video: videoUrl
        })

        await newMessage.save();
        //socket.io

        const recieverSocketId = getRecieverSocketId(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    }catch(error){
        console.error("Error sending message", error);
        res.status(500).json({message: "Internal server error"});
    }
}