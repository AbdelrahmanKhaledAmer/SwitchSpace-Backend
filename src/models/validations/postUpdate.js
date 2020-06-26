const Joi = require("@hapi/joi");

const itemSchemaValidator = require("./item");
const exchangeLocationShemaValidator = require("./exchangeLocation");

const postUpdateSchemaValidation = Joi.object({
    creatorId: Joi.string().alphanum(),
    creatorName: Joi.string().alphanum().min(2).max(50),
    itemOwned: itemSchemaValidator,
    itemDesired: itemSchemaValidator,
    exchangeLocation: exchangeLocationShemaValidator,
    photos: Joi.array(),
    postId: Joi.string().alphanum(),
});

module.exports = postUpdateSchemaValidation;
