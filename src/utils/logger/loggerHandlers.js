const logger = require("./logger")

// handle logging informations works as a Middleware
const infoHandler = async (req, res) => {
    let log = () => {
        let state = {};
        state.timestamp = Date.now();
        state.path = req.originalUrl;
        state.method = req.method;
        state.status = res.statusCode;
        logger.info("", state);
    };
    await res.on("finish", log);
};

// handle logging errors
const errorHandler = async (err) => {
    
    logger.error(`message - ${err.message}, stack trace - ${err.stack}`);
    
};
module.exports = {infoHandler,errorHandler};
