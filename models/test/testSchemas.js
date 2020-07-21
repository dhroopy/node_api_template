const Joi = require('@hapi/joi');

module.exports = {
  testSchemas: {
    userSchema: Joi.object({
      username: Joi.string().required().min(5).max(35),
    }),
    signInSchema: Joi.object({
      username: Joi.string().required().max(35).min(5),
      password: Joi.string().required(),
    }),
  },
};
