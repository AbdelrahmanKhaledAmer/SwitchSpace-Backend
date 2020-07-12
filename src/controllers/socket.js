const ChatModel = require("../models/schema/chat");
const UserModel = require("../models/schema/user");
const {chatMessageValidator} = require("../models/validations/chat");

// ********************************************************************************************************* //

const socketController = io => {
    return socket => {
        // let each socket join a room identified by the userId
        socket.join(socket.userId);
        // handling "chat message" event
        socket.on("chat message", async (data, callback) => {
            if (typeof callback !== "function") {
                return;
            }
            const validationVerdict = chatMessageValidator.validate(data);
            if (validationVerdict.error) {
                return callback({
                    success: false,
                    message: validationVerdict.error.details[0].message,
                });
            }
            try {
                const {receiverId, content} = data;
                const senderId = socket.userId;
                const message = {
                    senderId: senderId,
                    content: content,
                };
                // check if a user exists with the receiverId
                let receiver = await UserModel.findById(receiverId);
                if (!receiver) {
                    return callback({
                        success: false,
                        message: "No user found with id: " + receiverId,
                    });
                }

                // check if there is already an existing chat between the 2 participants
                let chat = await ChatModel.findOne({
                    $or: [
                        {$and: [{postOwnerId: senderId}, {interestedUserId: receiverId}]},
                        {$and: [{postOwnerId: receiverId}, {interestedUserId: senderId}]},
                    ],
                });
                if (chat) {
                    // if there is an existing chat, then push the new message
                    chat.messages.push(message);
                    await chat.save();
                } else {
                    // if there is no existing chat, then create a new one and push the new message
                    // the sender of the first message in the chat is alwyas the interestedUser
                    chat = await ChatModel.create({
                        interestedUserId: senderId,
                        postOwnerId: receiverId,
                        messages: [message],
                    });
                }

                // check if the receiver is offline -- no room found for the receiverId
                if (!io.sockets.adapter.rooms[data.receiverId]) {
                    if (receiverId === chat.postOwnerId.toHexString()) {
                        // increment unread chats for the post owner if this is the first unread message
                        if (chat.postOwnerUnread === 0) {
                            receiver.unreadChats += 1;
                            await receiver.save();
                        }
                        // increment unread messages in the chat for the post owner
                        chat.postOwnerUnread += 1;
                    } else {
                        // increment unread chats for the interested user if this is the first unread message
                        if (chat.interestedUserUnread === 0) {
                            receiver.unreadChats += 1;
                            await receiver.save();
                        }
                        // increment unread messages in the chat for the interested user
                        chat.interestedUserUnread += 1;
                    }
                    await chat.save();
                } else {
                    // send the message to the room which contains the receiver
                    io.to(data.receiverId).emit("chat message", message);
                }

                return callback({
                    success: true,
                });
            } catch (err) {
                return callback({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    };
};

module.exports = socketController;
