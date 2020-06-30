const Joi = require("@hapi/joi");

const reportSchemaValidator = Joi.object({
    reporterId: Joi.required(),
    reporterName: Joi.string().required(),
    postId: Joi.required(),
    complaint: Joi.required(),
});

module.exports = reportSchemaValidator;
