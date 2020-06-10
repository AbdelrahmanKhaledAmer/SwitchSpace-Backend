const Joi = require("@hapi/joi");

const itemSchemaValidator = Joi.object({
  title: Joi.string().required(),
  condition: Joi.string().valid("New", "Used").required(),
  modelYear: Joi.date(),
  description: Joi.string(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
});

module.exports = itemSchemaValidator;
