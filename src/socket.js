const socket = require("socket.io");
const {socketAuthentication} = require("./middlewares/middlewares");
const socketController = require("./controllers/socket");

const createSocketServer = httpServer => {
    // mount a Socket.IO server on the http server
    const io = socket(httpServer);

    // add authentication middleware
    io.use(socketAuthentication);

    // use socketController once a connection is established with the client
    io.on("connection", socketController(io));
};

module.exports = createSocketServer;
