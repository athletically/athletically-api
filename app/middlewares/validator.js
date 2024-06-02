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
        .max(20).allow(''),
        // .required()
        // .messages({
        //     'string.empty': `Password cannot be empty`,
        //     'any.required': `Please enter your password`
        //   })
        // source_type: Joi.number().required()
});

const customRegisterValidateSchema = Joi.object({
    password: Joi.string()
        .max(20).allow(''),
        // .messages({
        //     'string.empty': `Password cannot be empty`,
        //     'any.required': `Please enter your password`
        //   }),
    email: Joi.string().email()
        .required()
        .messages({
            'string.email': `Please enter a valid email`,
            'string.empty': `Email cannot be empty`,
            'any.required': `Please enter your Email`
          }),
    name: Joi.string().required().messages({
        'string.empty': `Name cannot be empty`,
        'any.required': `Please enter your Name`
      }),
    idToken: Joi.string().allow(''),
    photo: Joi.string().allow('')
});

const sendMailForgotPasswordValidateSchema = Joi.object({
    email: Joi.string().email()
        .required()
        .messages({
            'string.email': `Please enter a valid email`,
            'string.empty': `Email cannot be empty`,
            'any.required': `Please enter your Email`
        }),
})

const verifyOTPvalidateSchema = Joi.object({
    email: Joi.string().email()
        .required()
        .messages({
            'string.email': `Please enter a valid email`,
            'string.empty': `Email cannot be empty`,
            'any.required': `Please enter your Email`
        }),
    otp: Joi.string()
        .required()
        .messages({
            'string.empty': `OTP cannot be empty`,
            'any.required': `Please enter OTP`
        }),
})

const resetPasswordvalidateSchema = Joi.object({
    email: Joi.string().email()
        .required()
        .messages({
            'string.email': `Please enter a valid email`,
            'string.empty': `Email cannot be empty`,
            'any.required': `Please enter your Email`
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let updateProfileValidateSchema = Joi.object({
    name : Joi.string().required(),
    dob : Joi.string().allow(''),
    height : Joi.string().allow(''),
    weight : Joi.string().allow(''),
    country : Joi.string().allow(''),
    city : Joi.string().allow(''),
    competition_won : Joi.string().allow(''),
    previous_teams : Joi.string().allow(''),
    previous_coaches : Joi.string().allow(''),
    game_id : Joi.string().allow(''),
    user_id : Joi.string().required(),
    user_type : Joi.string().valid('viewer','player', 'other', 'team', 'orgs').required(),
    position_id : Joi.string().allow(''),
    awards : Joi.string().allow(''),
    medals : Joi.string().allow(''),
    previous_clubs : Joi.string().allow(''),
    current_clubs : Joi.string().allow(''),
    age : Joi.string().allow(''),
    certifications : Joi.string().allow(''),
    home_ground : Joi.string().allow(''),
    map_link : Joi.string().allow(''),
    team_size : Joi.string().allow(''),
    managements : Joi.string().allow(''),
    coaches : Joi.string().allow(''),
    other_stuffs : Joi.string().allow(''),
    players : Joi.string().allow(''),
    titles : Joi.string().allow(''),
    alumni_players : Joi.string().allow(''),
    active_competitions : Joi.string().allow(''),
    org_type : Joi.string().allow(''),
    org_desc : Joi.string().allow(''),
    estd : Joi.string().allow(''),
    key_parsonalities : Joi.string().allow(''),
    type : Joi.string().allow('')
})

let updateProfileValidate = async(req, res, next) => {
    try {
        console.log(req.body);
        const value = await updateProfileValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let getUserGroupListSchema = Joi.object({
    user_id : Joi.string().required(),
    search_string : Joi.string().allow('')
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
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
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let getLeaderboardValidateSchema = Joi.object({
    game_id : Joi.string().required(),
    filter : Joi.string().valid('overall', 'state').required(),
    year : Joi.string().required(),
})

let getLeaderboardValidate = async(req, res, next) => {
    try {
        const value = await getLeaderboardValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let addEventValidatorSchema = Joi.object({
    user_id : Joi.string().required(),
    event_title : Joi.string().required(),
    event_desc : Joi.string().required(),
    event_for : Joi.string().required(),
    scouted_by : Joi.string().allow(''),
    location : Joi.string().required(),
    map_link : Joi.string().required(),
    coached_by : Joi.string().allow(''),
    event_date : Joi.date().format('YYYY-MM-DD').required(),
    event_time : Joi.date().format('HH:mm').required(),
})

let addEventValidator = async(req, res, next) => {
    try {
        const value = await addEventValidatorSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let editEventValidatorSchema = Joi.object({
    user_id : Joi.string().required(),
    event_id : Joi.string().required(),
    event_title : Joi.string().allow(''),
    event_desc : Joi.string().allow(''),
    event_for : Joi.string().allow(''),
    scouted_by : Joi.string().allow(''),
    location : Joi.string().allow(''),
    map_link : Joi.string().allow(''),
    coached_by : Joi.string().allow(''),
    event_date : Joi.date().format('YYYY-MM-DD').allow(''),
    event_time : Joi.date().format('HH:mm').allow(''),
})

let editEventValidator = async(req, res, next) => {
    try {
        const value = await editEventValidatorSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let deleteEventValidatorSchema = Joi.object({
    user_id : Joi.string().required(),
    event_id : Joi.string().required()
})

let deleteEventValidator = async(req, res, next) => {
    try {
        const value = await deleteEventValidatorSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let getEventsValidatorSchema = Joi.object({
    user_id : Joi.string().required(),
    date : Joi.date().format('YYYY-MM-DD'),
})

let getEventsValidator = async(req, res, next) => {
    try {
        const value = await getEventsValidatorSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let getVideosValidateSchema = Joi.object({
    user_id : Joi.string().required(),
    type : Joi.string().valid('reel', 'match', 'podcast').required()
})

let getVideosValidate = async(req, res, next) => {
    try {
        const value = await getVideosValidateSchema.validate(req.query);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let getUserGroupsValidateSchema = Joi.object({
    user_id : Joi.string().required()
})

let getUserGroupsValidate = async(req, res, next) => {
    try {
        const value = await getUserGroupsValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let validateTokenValidateSchema = Joi.object({
    token : Joi.string().required()
})

let validateTokenValidate = async(req, res, next) => {
    try {
        const value = await validateTokenValidateSchema.validate(req.query);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let getPreviousChatByGroupIdValidateSchema = Joi.object({
    group_id : Joi.string().required()
})

let getPreviousChatByGroupIdValidate = async(req, res, next) => {
    try {
        const value = await getPreviousChatByGroupIdValidateSchema.validate(req.query);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        err.message = err.message.replace('ValidationError: ', "");
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
    followUserValidate: followUserValidate,
    getLeaderboardValidate: getLeaderboardValidate,
    addEventValidator: addEventValidator,
    editEventValidator: editEventValidator,
    deleteEventValidator : deleteEventValidator,
    getEventsValidator : getEventsValidator,
    getVideosValidate : getVideosValidate,
    getUserGroupsValidate : getUserGroupsValidate,
    validateTokenValidate : validateTokenValidate,
    getPreviousChatByGroupIdValidate : getPreviousChatByGroupIdValidate
}