const Joi = require("@hapi/joi");

const itemSchemaValidator = require("./item");
const exchangeLocationShemaValidator = require("./exchangeLocation");

const postShemaValidation = Joi.object({
  creatorId: Joi.string().alphanum().required(),
  creatorName: Joi.string().alphanum().min(2).max(50).required(),
  itemOwned: itemSchemaValidator.required(),
  itemDesired: itemSchemaValidator.required(),
  exchangeLocation: exchangeLocationShemaValidator.required(),
  photos: Joi.array().items(Joi.object()).required(),
});

module.exports = postShemaValidation;
