const Joi = require("@hapi/joi");

const registerValidator = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  // use simple password for now and use strong password after developing the BE
  // new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  password: Joi.string().required(),

  repeatPassword: Joi.ref("password"),

  name: Joi.string().alphanum().min(2).max(50).required(),
}).with("password", "repeatPassword");

module.exports = registerValidator;
