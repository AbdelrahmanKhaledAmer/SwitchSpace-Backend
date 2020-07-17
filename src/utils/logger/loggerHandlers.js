const logger = require("./logger");

const dateFormat = () => {
    return new Date(Date.now()).toLocaleString();
};

// handle logging req/res info => works as a Middleware
const infoHandler = async (req, res) => {
    let log = () => {
        let state = {};
        state.timestamp = dateFormat();
        state.path = req.originalUrl;
        state.method = req.method;
        state.status = res.statusCode;
        logger.info("", state);
    };
    await res.on("finish", log);
};
// system notifications
const systemInfo = msg => {
    let state = {};
    state.timestamp = dateFormat();
    state.type = "systemInfo";
    state.message = msg;
    logger.info("", state);
};
// handle logging errors
const errorHandler = async err => {
    logger.error(`message - ${err.message}, stack trace - ${err.stack}`);
};
module.exports = {infoHandler, errorHandler, systemInfo};
