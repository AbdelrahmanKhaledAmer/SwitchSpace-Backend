const Joi = require("@hapi/joi");

const registerValidator = Joi.object({
  // use simple password for now and use strong password after developing the BE
  // new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  password: Joi.string(),

  repeatPassword: Joi.ref("password"),

  name: Joi.string().alphanum().min(2).max(50),
}).with("password", "repeatPassword");

module.exports = registerValidator;
