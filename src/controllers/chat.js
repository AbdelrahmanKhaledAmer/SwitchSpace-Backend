const ChatModel = require("../models/schema/chat");
const UserModel = require("../models/schema/user");

// ********************************************************************************************************* //

// get the list of previous chats
const getChatList = async (req, res) => {
    try {
        const chatList = await ChatModel.find({
            $or: [{postOwnerId: req.userId}, {interestedUserId: req.userId}],
        });
        let resData = [];
        // build the response data
        for (const chat of chatList) {
            // get the id of the other user participating in the chat
            const otherUserId = req.userId === chat.postOwnerId.toHexString() ? chat.interestedUserId : chat.postOwnerId;
            // only retrieve the name and profilePicture fields of the othe user
            const otherUser = await UserModel.findById(otherUserId, "name profilePicture");
            // get the last message sent in the chat to view it in the chat list
            let lastMessage = null;
            if (chat.messages.length > 0) {
                lastMessage = chat.messages[chat.messages.length - 1];
            }
            // get the number of unread messages
            const unread = req.userId === chat.postOwnerId.toHexString() ? chat.postOwnerUnread : chat.interestedUserUnread;
            // push the current chat data to resData array
            resData.push({
                otherUserId: otherUserId,
                otherUserName: otherUser.name,
                otherUserPicture: otherUser.profilePicture,
                unread: unread,
                lastMessage: lastMessage,
            });
        }
        res.status(200).json({data: resData});
    } catch (err) {
        res.status(500).json({message: "Internal server error"});
    }
};

// ********************************************************************************************************* //

// get the chat history with another user
const getChatHistory = async (req, res) => {
    const otherUserId = req.params.otherUserId;
    try {
        // only retrieve the name and profilePicture fields of the othe user
        const otherUser = await UserModel.findById(otherUserId, "name profilePicture");
        if (!otherUser) {
            res.status(404).json({
                message: "No user found with id: " + otherUserId,
            });
        }
        // get previous chat messages if a chat already exists
        let chatMessages = [];
        let chat = await ChatModel.findOne({
            $or: [
                {$and: [{postOwnerId: req.userId}, {interestedUserId: otherUserId}]},
                {$and: [{postOwnerId: otherUserId}, {interestedUserId: req.userId}]},
            ],
        });
        if (chat) {
            chatMessages = chat.messages;
            let unread = 0;
            // reset unread messages to 0 in the chat
            if (req.userId === chat.postOwnerId.toHexString()) {
                unread = chat.postOwnerUnread;
                chat.postOwnerUnread = 0;
            } else {
                unread = chat.interestedUserUnread;
                chat.interestedUserUnread = 0;
            }
            await chat.save();
            // In case there were unread messages, decrement unread chats for the user who just retrieved the chat history
            if (unread > 0) {
                await UserModel.findByIdAndUpdate(req.userId, {$inc: {unreadChats: -1}});
            }
        }
        res.status(200).json({
            data: {
                otherUserName: otherUser.name,
                otherUserPicture: otherUser.profilePicture,
                messages: chatMessages,
            },
        });
    } catch (err) {
        res.status(500).json({message: "Internal server error"});
    }
};

// ********************************************************************************************************* //

// get the number of chats which have unread messages
const getUnreadChats = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId, "unreadChats");
        return res.status(200).json({
            data: {
                unreadChats: user.unreadChats,
            },
        });
    } catch (err) {
        res.status(500).json({message: "Internal server error"});
    }
};

module.exports = {
    getChatList,
    getChatHistory,
    getUnreadChats,
};
