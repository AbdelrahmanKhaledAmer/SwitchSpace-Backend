const logger = require("../utils/logger/loggerHandlers");

// handle logging informations works as a Middleware
const infoHandler = async (req, res, next) => {
    next();
    logger.infoHandler(req, res);
};

module.exports = {infoHandler};
