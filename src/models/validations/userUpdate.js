const Joi = require("@hapi/joi");
const passwordComplexity = require("joi-password-complexity");
const passwordComplexityOpts = {
    min: 8,
    max: 50,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

const registerValidator = Joi.object({
    // use simple password for now and use strong password after developing the BE
    // new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    password: passwordComplexity(passwordComplexityOpts),

    repeatPassword: Joi.ref("password"),

    name: Joi.string().alphanum().min(2).max(50),
}).with("password", "repeatPassword");

module.exports = registerValidator;
