"use strict";

const http = require("http");
const mongoose = require("mongoose");

const api = require("./src/api");
const config = require("./src/config");
const createSocketServer = require("./src/socket");

// set the port to the API.
api.set("port", config.port);

// create a http server based on Express
const server = http.createServer(api);

// create a Socket.IO server
createSocketServer(server);

//Connect to the MongoDB database; then start the server
mongoose.set("useUnifiedTopology", true);

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true })
  .then(() => server.listen(config.port))
  .catch((err) => {
    console.log("Error connecting to the database", err.message);
    process.exit(err.statusCode);
  });

server.on("listening", () => {
  console.log(`API is running in port ${config.port}`);
});

server.on("error", (err) => {
  console.log("Error in the server", err.message);
  process.exit(err.statusCode);
});
