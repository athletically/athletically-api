const response = require('./../libs/responseLib')
const check = require('../libs/checkLib')
const appConfig = require('../../config/appConfig');
const time = require('../libs/timeLib');
const otpLib = require('../libs/otpLib');
const notification = require('../libs/notificationLib');
const { v4: uuidv4 } = require('uuid');
const tokenLib = require('../libs/tokenLib');
const passwordLib = require('../libs/passwordLib');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const otpModel = mongoose.model('OTP');
const uploadLib = require('../libs/uploadLib');
const timeLib = require('../libs/timeLib');
const notificationLib = require('../libs/notificationLib');
const checkLib = require('../libs/checkLib');

let test = async(req, res) => {
    res.status(200).json('Server is running');
}

let login = async(req, res) => {

    try {
        console.log('body ', req.body);
        let finduser = await UserModel.findOne({ username: req.body.username }).select('-__v -_id').lean();

        if (check.isEmpty(finduser)) {
            res.status(404);
            throw new Error('User not Registered!');
        };
        if (await passwordLib.verify(req.body.password, finduser.password)) {
            console.log('verified!');
            if ((finduser.user_type != 1) || (!finduser.is_active)) {
                res.status(401);
                throw new Error('Authorization Failed!');
            } else {
                let payload = {
                    username: finduser.username,
                    email: finduser.email,
                    user_type: finduser.user_type,
                    token: await tokenLib.generateToken(finduser)
                };
                let apiResponse = response.generate(false, 'logged in!', payload);
                res.status(200).send(apiResponse);
            }
        } else {
            res.status(401);
            throw new Error('incorrect password!');
        }
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}

let register = async(req, res) => {
    try {
        let finduser = await UserModel.findOne({$or : [ { username: req.body.username } , { email: req.body.email }]}).select('-__v -_id').lean();

        if (!check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('Username or Email already in use!');
        };

        let newUser = new UserModel({
            username: req.body.username,
            email: req.body.email.toLowerCase(),
            password: await passwordLib.hash(req.body.password),
            created_on: time.now()
        });

        let payload = (await newUser.save()).toObject();

        delete payload.__v;
        delete payload._id;
        delete payload.password;

        let apiResponse = response.generate(false, 'Created new user', payload);
        res.status(200).send(apiResponse);

        
    } catch (err) {
        let apiResponse = response.generate(true, err.message, null);
        res.send(apiResponse);
    }
}

let sendOtpForgotPassword = async(req, res) => {
    try {
        let finduser = await UserModel.findOne({ username: req.body.username }).select('-__v').lean();

        if (check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('An account with this username is not found!');
        };
        let email = finduser.email;
        let otp = otpLib.generateOtp(6);

        notificationLib.sendEmail({email : email, otp : otp}).then(async(sendEmail) => {
            if(sendEmail.err === false){

                let newOTP = new otpModel({
                    user_id : finduser._id,
                    otp : otp,
                    created_on : timeLib.now()
                })
                if(await newOTP.save()){
                    let apiResponse = response.generate(false, 'An OTP has been sent to your registered email.');
                    res.status(200).send(apiResponse);
                }
                else{
                    let apiResponse = response.generate(true, 'Unable to send OTP. Try after sometimes.');
                    res.status(500).send(apiResponse);
                }
            }
            else{
                let apiResponse = response.generate(true, 'Unable to send OTP. Try after sometimes.');
                res.status(500).send(apiResponse);
            }
        })
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.send(apiResponse);
    }
}

let verifyOTP = async(req, res) => {
    try {
        let finduser = await UserModel.findOne({ username: req.body.username }).select('-__v').lean();

        if (check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('An account with this username is not found!');
        };
        let otp = req.body.otp;

        let sentOTP = await otpModel.findOne({user_id : finduser._id, otp : otp}).lean();

        if(!checkLib.isEmpty(sentOTP)){
            let apiResponse = response.generate(false, 'OTP verified. You can update your password now.');
            res.status(200).send(apiResponse);
        }
        else{
            let apiResponse = response.generate(true, 'OTP verification failed.');
            res.status(412).send(apiResponse);
        }
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.send(apiResponse);
    }
}

let resetPassword = async(req, res) => {
    try {
        let finduser = await UserModel.findOne({ username: req.body.username }).select('-__v').lean();

        if (check.isEmpty(finduser)) {
            res.status(412);
            throw new Error('An account with this username is not found!');
        };
        let password = await passwordLib.hash(req.body.password);

        let updated = await UserModel.findOneAndUpdate({_id : finduser._id}, {password : password}, { new : true }).lean();

        if(!checkLib.isEmpty(updated)){
            let apiResponse = response.generate(false, 'Password Reset Successful.');
            res.status(200).send(apiResponse);
        }
        else{
            let apiResponse = response.generate(true, 'Password Reset failed.');
            res.status(412).send(apiResponse);
        }
    } catch (error) {
        let apiResponse = response.generate(true, error.message, null);
        res.send(apiResponse);
    }
}



module.exports = {
    test: test,
    login: login,
    register: register,
    sendOtpForgotPassword: sendOtpForgotPassword,
    verifyOTP: verifyOTP,
    resetPassword: resetPassword,
}