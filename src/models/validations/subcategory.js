const Joi = require("@hapi/joi");

const subcategorySchemaValidator = Joi.object({
    title: Joi.string().required(),
});

module.exports = subcategorySchemaValidator;
