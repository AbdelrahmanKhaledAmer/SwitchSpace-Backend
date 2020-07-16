const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const objectIdValidator = Joi.object({
    id: Joi.objectId().required(),
});

module.exports = objectIdValidator;
