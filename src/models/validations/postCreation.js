const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const itemSchemaValidator = require("./item");
const exchangeLocationShemaValidator = require("./exchangeLocation");

const postCreationValidator = Joi.object({
    creatorId: Joi.objectId().required(),
    creatorName: Joi.string().min(2).max(50).required(),
    itemOwned: itemSchemaValidator.required(),
    itemDesired: itemSchemaValidator.required(),
    exchangeLocation: exchangeLocationShemaValidator.required(),
});

module.exports = postCreationValidator;
