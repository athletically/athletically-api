const fs = require('fs');
const path = require('path');
const userController = require('../controllers/userController');
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const validator = require('../middlewares/validator');


module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.get(`${baseUrl}/`, userController.test);
    app.post(`${baseUrl}/login`, validator.loginValidate, userController.login);
    app.post(`${baseUrl}/register`, validator.registerValidate, userController.register);
    app.post(`${baseUrl}/send-otp`, validator.sendMailForgotPasswordValidate, userController.sendOtpForgotPassword);
    app.post(`${baseUrl}/verify-otp`, validator.verifyOTPvalidate, userController.verifyOTP);
    app.post(`${baseUrl}/reset-password`, validator.resetPasswordvalidate, userController.resetPassword);
    app.get(`${baseUrl}/get-all-reels`, userController.getAllReels);


};