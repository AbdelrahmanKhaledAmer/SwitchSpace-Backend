const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const itemSchemaValidator = require("./item");
const exchangeLocationShemaValidator = require("./exchangeLocation");

const postUpdateValidator = Joi.object({
    creatorId: Joi.objectId().required(),
    creatorName: Joi.string().min(2).max(50),
    itemOwned: itemSchemaValidator,
    itemDesired: itemSchemaValidator,
    exchangeLocation: exchangeLocationShemaValidator,
    photos: Joi.array().items(Joi.object()),
    postId: Joi.objectId().required(),
});

module.exports = postUpdateValidator;
