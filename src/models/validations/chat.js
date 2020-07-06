const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const chatMessageValidator = Joi.object({
    receiverId: Joi.objectId().required(),
    content: Joi.string().required(),
});

module.exports = {
    chatMessageValidator,
};
