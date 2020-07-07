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
                const receiver = await UserModel.findById(receiverId);
                if (!receiver) {
                    return callback({
                        success: false,
                        message: "No user found with id: " + receiverId,
                    });
                }

                // check if there is already an existing chat between the 2 participants
                const chat = await ChatModel.findOne({
                    participantsId: {$all: [receiverId, senderId]},
                });
                if (chat) {
                    // if there is an existing chat, then push the new message
                    chat.messages.push(message);
                    await chat.save();
                } else {
                    // if there is no existing chat, then create a new one and push the new message
                    await ChatModel.create({
                        participantsId: [receiverId, senderId],
                        messages: [message],
                    });
                }

                // send the message to the room which contains the receiver
                // TODO: if the receiving socket is offline, then have a mechanism to notify him with unread messages when he is online again
                io.to(data.receiverId).emit("chat message", message);

                return callback({
                    success: true,
                });
            } catch (error) {
                return callback({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    };
};

module.exports = socketController;
