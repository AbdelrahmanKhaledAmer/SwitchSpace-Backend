const Joi = require("@hapi/joi");

const userSchemaValidator = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  // use simple password for now and use strong password after developing the BE
  // new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),

  repeatPassword: Joi.ref("password"),

  name: Joi.string().alphanum().min(2).max(50).required(),
}).with("password", "repeatPassword");

module.exports = userSchemaValidator;
