const Joi = require('joi');

const createUserSchema = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().min(1).max(11).required(),
    gender: Joi.string().valid('male', 'female')
});

const signinSchema = Joi.object({
    phone: Joi.string().min(1).max(11).required()
})

module.exports = {
    createUserSchema,
    signinSchema
}