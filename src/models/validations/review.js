const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const reviewSchemaValidator = Joi.object({
    reviewerId: Joi.objectId().required(),
    commRate: Joi.number().min(1).max(5).required(),
    conditionRate: Joi.number().min(1).max(5).required(),
    descriptionRate: Joi.number().min(1).max(5).required(),
    description: Joi.string().allow("").max(500),
});

module.exports = reviewSchemaValidator;
