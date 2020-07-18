"use strict";

const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const api = require("./src/api");
const config = require("./src/config");
const createSocketServer = require("./src/socket");
const loggerHandlers = require("./src/utils/logger/loggerHandlers");

// set the port to the API.
api.set("port", config.port);

// create a http server based on Express
const server = http.createServer(api);

// create a Socket.IO server
createSocketServer(server);

//Connect to the MongoDB database; then start the server
mongoose.set("useUnifiedTopology", true);

mongoose
    .connect(config.mongoURI, {useNewUrlParser: true})
    .then(() => server.listen(config.port))
    .catch(err => {
        loggerHandlers.errorHandler(err);
        process.exit(err.statusCode);
    });

server.on("listening", () => {
    loggerHandlers.systemInfo(`SwitchSpace API (v1.0) is running on port ${config.port}`);
});

server.on("error", err => {
    loggerHandlers.errorHandler(err);
    process.exit(err.statusCode);
});
