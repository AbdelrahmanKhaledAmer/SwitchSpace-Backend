const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const reportSchemaValidator = Joi.object({
    reporterId: Joi.objectId().required(),
    reporterName: Joi.string().required(),
    postId: Joi.objectId().required(),
    complaint: Joi.string().required(),
});

module.exports = reportSchemaValidator;
