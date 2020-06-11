const Joi = require("@hapi/joi");

const reportSchemaValidator = Joi.object({
  reporterID: Joi.required(),
  postID: Joi.required(),
  complaint: Joi.required(),
});

module.exports = reportSchemaValidator;
