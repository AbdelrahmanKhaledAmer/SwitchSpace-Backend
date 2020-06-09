const Joi = require("@hapi/joi");
const categorySchemaValidator = require("./category")
const subcategorySchemaValidator = require("./subcategory")

const itemSchemaValidator = Joi.object({
    title: Joi.string().required(),
    condition: Joi.string().valid("New", "Used").required(),
    modelYear: Joi.date(),
    description: Joi.string(),
    category: categorySchemaValidator,
    subcategory: subcategorySchemaValidator
});


module.exports = itemSchemaValidator;