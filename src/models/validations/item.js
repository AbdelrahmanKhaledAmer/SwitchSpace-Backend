const Joi = require("@hapi/joi");

const itemSchemaValidator = Joi.object({
    title: Joi.string().required(),
    condition: Joi.string().valid("New", "Used").required(),
    modelYear: Joi.number().optional(),
    description: Joi.string().allow(""),
    category: Joi.string().required(),
    subcategory: Joi.string().allow(""),
});

module.exports = itemSchemaValidator;
