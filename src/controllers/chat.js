const ChatModel = require("../models/schema/chat");
const UserModel = require("../models/schema/user");

// ********************************************************************************************************* //

// get the list of previous chats
const getChatList = async (req, res) => {
  try {
    const chatList = await ChatModel.find({
      participantsId: { $in: [req.userId] },
    });
    let resData = [];
    // build the response data
    for (const chat of chatList) {
      // get the id of the other user participating in the chat
      let otherUserId = null;
      for (const participantId of chat.participantsId) {
        if (!participantId.equals(req.userId)) {
          otherUserId = participantId;
        }
      }
      // only retrieve the name and profilePicture fields of the othe user
      const otherUser = await UserModel.findById(otherUserId, {
        name: 1,
        profilePicture: 1,
      });
      // get the last message sent in the chat to view it in the chat list
      let lastMessage = null;
      if (chat.messages.length > 0) {
        lastMessage = chat.messages[chat.messages.length - 1];
      }
      // push the current chat data to resData array
      // TODO: adjust otherUserProfilePicture filed when picture uploading feature is implemented
      resData.push({
        otherUserId: otherUserId,
        otherUserName: otherUser.name,
        otherUserProfilePicture: otherUser.profilePicture,
        lastMessage: lastMessage,
      });
    }
    res.status(200).json({ data: resData });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ********************************************************************************************************* //

// get the chat history with another user
const getChatHistory = async (req, res) => {
  try {
    const otherUserId = req.params.otherUserId;
    // only retrieve the name and profilePicture fields of the othe user
    const otherUser = await UserModel.findById(otherUserId, {
      name: 1,
      profilePicture: 1,
    });
    if (!otherUser) {
      res.status(404).json({
        message: "No user found with id: " + otherUserId,
      });
    }
    // get previous chat messages if a chat already exists
    let chatMessages = [];
    const chat = await ChatModel.findOne({
      participantsId: { $all: [req.userId, otherUserId] },
    });
    if (chat) {
      chatMessages = chat.messages;
    }
    // TODO: adjust otherUserProfilePicture filed when picture uploading feature is implemented
    res.status(200).json({
      data: {
        otherUserName: otherUser.name,
        otherUserProfilePicture: otherUser.profilePicture,
        chatMessages: chatMessages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getChatList,
  getChatHistory,
};
