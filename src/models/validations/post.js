const Joi = require("@hapi/joi");

const itemSchemaValidator = require("./item");
const exchangeLocationShemaValidator = require("./exchangeLocation");

const postShemaValidation = Joi.object({
  creatorID: Joi.string().alphanum().required(),
  itemOwned: itemSchemaValidator.required(),
  itemDesired: itemSchemaValidator.required(),
  exchangeLocation: exchangeLocationShemaValidator.required(),
  photos: Joi.array().items(Joi.string()).required(),
});

module.exports = postShemaValidation;
