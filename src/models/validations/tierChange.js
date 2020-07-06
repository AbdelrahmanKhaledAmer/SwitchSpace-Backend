const Joi = require("@hapi/joi");

const reportSchemaValidator = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    stripeToken: Joi.string().required(),
    tier: Joi.string()
        .valid(...["Per Post", "Limited Subscription", "Unlimited Subscription"])
        .required(),
});

module.exports = reportSchemaValidator;
