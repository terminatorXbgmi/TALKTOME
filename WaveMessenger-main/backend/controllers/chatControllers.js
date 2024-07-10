const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");



const accessChat = async (req, res) => {
  const { userId } = req.body;
  console.log("dfkjbsduv  ",userId)

  if (!userId) {
    return res
      .status(400)
      .json({ message: "UserId parameter is missing in the request" });
  }

  try {
    // Check if a chat exists between the current user and the provided userId
   

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    

    // Populate sender information for the latest message
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
     console.log("userId  ", userId);
     console.log(isChat);
    if (isChat.length > 0) {
      return res.status(200).json(isChat[0]);
    } else {
      // If chat doesn't exist, create a new chat
      console.log("userId  ",userId);
      const chatData = {
        chatName: userId,
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).json(FullChat);
    }
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// to find all chats of loged in user
const fetchChats = async (req, res) => {
  try {
   //  console.log("user in fetchchat", req.user);
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {

        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// to create goupt chat

const createGroupChat = async(req,res)=>{
  
// in group chat we will fill chat name and list of users

if(!req.body.name || !req.body.users){
  return res.status(400).json({message:"Please Fill all the feilds"});

}

// we will get a array of users so we can't send it directly so we have to 
//convert it into string in frontend and in backend we have to parse it into json format

var users = JSON.parse(req.body.users);

if(users.length<2){
   return res.status(400).json({ message: "More Than two users are required to form a group chat" });
}

// our logged in member will also be part of this group chat
users.push(req.user);

try {
 
  const groupChat = await Chat.create({
    chatName:req.body.name,
    users: users,
    isGroupChat:true,
    groupAdmin: req.user,

  });

  const fullGroupChat = await Chat.findOne({_id:groupChat._id})
       .populate("users","-password")
       .populate("groupAdmin","-password");

       res.status(200).json(fullGroupChat);





} catch (error) {
  // Handle errors
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal server error" });
}


}

// rename group

const renameGroup = async(req,res)=>{
  
  const {chatId,chatName} = req.body;

try {
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },

    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(404).json({ ERROR: "Chat Not Found" });
  }

  res.status(200).json(updatedChat);
} catch (error) {
  // Handle errors
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal server error" });
}


}

//addToGroup

const addToGroup = async(req,res)=>{
  // chatid ::::::::where i have to add my user
  //userid::::::to whom i have ot add

  const {chatId,userId} = req.body;

  try {

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      return res.status(404).json({ ERROR: "Chat Not Found" });
    }

    res.status(200).json(added);

  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
 

}

//removefrom group

const removeFromGroup = async(req,res)=>{
 
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(404).json({ ERROR: "Chat Not Found" });
    }

    res.status(200).json(removed);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



module.exports = {accessChat, fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup};