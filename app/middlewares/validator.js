const responseLib = require('../libs/responseLib');

const Joi = require('joi').extend(require('@joi/date'));


const customLoginValidateSchema = Joi.object({
    email: Joi.string()
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

const sendMailForgotPasswordValidateSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': `Username cannot be empty`,
            'any.required': `Please enter your username`
        })
})

const verifyOTPvalidateSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': `Username cannot be empty`,
            'any.required': `Please enter your username`
        }),
    otp: Joi.string()
        .required()
        .messages({
            'string.empty': `OTP cannot be empty`,
            'any.required': `Please enter OTP`
        }),
})

const resetPasswordvalidateSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': `Username cannot be empty`,
            'any.required': `Please enter your username`
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': `Password cannot be empty`,
            'any.required': `Please enter new Password`
        }),
})

const homepageReelsValidateSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.empty': `Username cannot be empty`,
            'any.required': `Please enter your username`
    })
        // source_type: Joi.number().required()
});

const getAllReelsOfUserValidateSchema = Joi.object({
    reel_id: Joi.string()
        .required()
})


const createReelsValidateSchema = Joi.object({
    post: Joi.string(),
    user_id: Joi.string()
        .required(),


})


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

let sendMailForgotPasswordValidate = async(req, res, next) => {
    try {
        const value = await sendMailForgotPasswordValidateSchema.validate(req.body);
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

let verifyOTPvalidate = async(req, res, next) => {
    try {
        const value = await verifyOTPvalidateSchema.validate(req.body);
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

let resetPasswordvalidate = async(req, res, next) => {
    try {
        const value = await resetPasswordvalidateSchema.validate(req.body);
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

let homepageReelsValidate = async(req, res, next) => {
    try {
        const value = await homepageReelsValidateSchema.validate(req.body);
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

let getAllReelsOfUserValidate = async(req, res, next) => {
    try {
        const value = await getAllReelsOfUserValidateSchema.validate(req.body);
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


let createReelsValidate = async(req, res, next) => {
    try {
        const value = await createReelsValidateSchema.validate(req.body);
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

const likePostValidateSchema = Joi.object({
    liked_by : Joi.string().required(),
    reel_id : Joi.string().required()
})


let likePostValidate = async(req, res, next) => {
    try {
        const value = await likePostValidateSchema.validate(req.body);
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


const dislikePostValidateSchema = Joi.object({
    disliked_by : Joi.string().required(),
    reel_id : Joi.string().required()
})


let dislikePostValidate = async(req, res, next) => {
    try {
        const value = await dislikePostValidateSchema.validate(req.body);
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


const commentPostValidateSchema = Joi.object({
    comment_by : Joi.string().required(),
    reel_id : Joi.string().required(),
    comment : Joi.string().required()
})


let commentPostValidate = async(req, res, next) => {
    try {
        const value = await commentPostValidateSchema.validate(req.body);
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

let getPostionValidateSchema = Joi.object({
    game_id : Joi.string().required()
})

let getPostionValidate = async(req, res, next) => {
    try {
        const value = await getPostionValidateSchema.validate(req.query);
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

let updateProfileValidateSchema = Joi.object({
    name : Joi.string(),
    dob : Joi.string(),
    height : Joi.string(),
    width : Joi.string(),
    country : Joi.string(),
    city : Joi.string(),
    competition_won : Joi.array(),
    previous_teams : Joi.array(),
    previous_coaches : Joi.array(),
    game_id : Joi.string().required(),
    user_id : Joi.string().required(),
    position_id : Joi.string().required()
})

let updateProfileValidate = async(req, res, next) => {
    try {
        const value = await updateProfileValidateSchema.validate(req.body);
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

let addGameSchema = Joi.object({
    game_name : Joi.string().required(),
})

let addGameValidate = async(req, res, next) => {
    try {
        const value = await addGameSchema.validate(req.body);
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


let addPositionSchema = Joi.object({
    game_id : Joi.string().required(),
    position_name : Joi.string().required(),
})

let addPositionValidate = async(req, res, next) => {
    try {
        const value = await addPositionSchema.validate(req.body);
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

let addGroupSchema = Joi.object({
    game_id : Joi.string().required(),
    position_id : Joi.string().required(),
    group_name : Joi.string().required(),
})

let addGroupValidate = async(req, res, next) => {
    try {
        const value = await addGroupSchema.validate(req.body);
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

let getUserGroupListSchema = Joi.object({
    user_id : Joi.string().required()
})

let getUserGroupListValidate = async(req, res, next) => {
    try {
        const value = await getUserGroupListSchema.validate(req.query);
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

let updateViewSchema = Joi.object({
    reel_id : Joi.string().required()
})

let updateViewValidate = async(req, res, next) => {
    try {
        const value = await updateViewSchema.validate(req.body);
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

let followUserValidateSchema = Joi.object({
    user_id : Joi.string().required()
})

let followUserValidate = async(req, res, next) => {
    try {
        const value = await followUserValidateSchema.validate(req.body);
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
    registerValidate: registerValidate,
    sendMailForgotPasswordValidate: sendMailForgotPasswordValidate,
    verifyOTPvalidate: verifyOTPvalidate,
    resetPasswordvalidate: resetPasswordvalidate,
    homepageReelsValidate: homepageReelsValidate,
    getAllReelsOfUserValidate: getAllReelsOfUserValidate,
    createReelsValidate: createReelsValidate,
    likePostValidate: likePostValidate,
    dislikePostValidate: dislikePostValidate,
    commentPostValidate: commentPostValidate,
    getPostionValidate: getPostionValidate,
    updateProfileValidate: updateProfileValidate,
    addGameValidate: addGameValidate,
    addPositionValidate: addPositionValidate,
    addGroupValidate: addGroupValidate,
    getUserGroupListValidate: getUserGroupListValidate,
    updateViewValidate: updateViewValidate,
    followUserValidate: followUserValidate
}