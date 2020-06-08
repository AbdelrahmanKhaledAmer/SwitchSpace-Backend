const Joi = require("@hapi/joi")

const exchangeLocationSchemaValidation = Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).required()
});

module.exports = exchangeLocationSchemaValidation;