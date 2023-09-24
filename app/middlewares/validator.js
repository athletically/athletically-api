const responseLib = require('../libs/responseLib');

const Joi = require('joi').extend(require('@joi/date'));


const customLoginValidateSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': `Username cannot be empty`,
            'any.required': `Please enter your username`
          }),
    password: Joi.string()
        .max(20)
        .required()
        .messages({
            'string.empty': `Password cannot be empty`,
            'any.required': `Please enter your password`
          })
        // source_type: Joi.number().required()
});

const customRegisterValidateSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': `Username cannot be empty`,
            'any.required': `Please enter your username`
          }),
    password: Joi.string()
        .max(20)
        .required()
        .messages({
            'string.empty': `Password cannot be empty`,
            'any.required': `Please enter your password`
          }),
    email: Joi.string().email()
        .required()
        .messages({
            'string.email': `Please enter a valid email`,
            'string.empty': `Email cannot be empty`,
            'any.required': `Please enter your Email`
          }),
});




let loginValidate = async(req, res, next) => {
    try {
        const value = await customLoginValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}


let registerValidate = async(req, res, next) => {
    try {
        const value = await customRegisterValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}


module.exports = {
    loginValidate: loginValidate,
    registerValidate: registerValidate
}