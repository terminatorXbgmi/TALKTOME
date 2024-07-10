const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
const Message = require("../Models/messageModel");

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // console.log("user in sendmessage",req.user);
  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");

   message = await message.populate({
     path: "chat.users",
     select: "name pic email",
     model: "User", // Specify the model to use for populating
   });

    // Update the latestMessage field in the chat document
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const allMessages = async (req, res) => {

    try{
        
  //  console.log("user in allmessage", req.user);
     const messages = await Message.find({chat: req.params?.chatId}).populate(
        "sender" , "name pic email"
     ).populate("chat");

     res.json(messages);


    }catch(error){
   console.error(error);
   res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { sendMessage, allMessages };
