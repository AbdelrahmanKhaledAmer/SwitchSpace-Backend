const Joi = require("@hapi/joi");

const chatMessageValidator = Joi.object({
    receiverId: Joi.string().alphanum().required(),
    content: Joi.string().required(),
});

module.exports = {
    chatMessageValidator,
};
