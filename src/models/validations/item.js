const Joi = require("@hapi/joi");
const categorySchemaValidator = require("./category")
const subcategorySchemaValidator = require("./subcategory")

const itemSchemaValidator = Joi.object({
    title: Joi.string().alphanum().required(),
    condition: Joi.string().valid("New", "Used").required(),
    modelYear: Joi.date(),
    description: Joi.string().alphanum(),
    category: categorySchemaValidator,
    subcategory: subcategorySchemaValidator
});


module.exports = itemSchemaValidator;