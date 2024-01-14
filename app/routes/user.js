const fs = require('fs');
const path = require('path');
const userController = require('../controllers/userController');
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const validator = require('../middlewares/validator');
const multer = require('multer');

// Configure multer for handling form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.get(`${baseUrl}/`, userController.test);
    app.post(`${baseUrl}/login`, validator.loginValidate, userController.login);
    app.post(`${baseUrl}/register`, validator.registerValidate, userController.register);
    app.post(`${baseUrl}/send-otp`, validator.sendMailForgotPasswordValidate, userController.sendOtpForgotPassword);
    app.post(`${baseUrl}/verify-otp`, validator.verifyOTPvalidate, userController.verifyOTP);
    app.post(`${baseUrl}/reset-password`, validator.resetPasswordvalidate, userController.resetPassword);
    app.get(`${baseUrl}/get-all-reels`, auth.isAuthorized, userController.getAllReels);
    // app.post(`${baseUrl}/get-homepage-reels`, validator.homepageReelsValidate, userController.homePageReels);
    app.get(`${baseUrl}/get-homepage-reels`, userController.homePageReels);
    app.post(`${baseUrl}/get-user-reels`, validator.getAllReelsOfUserValidate, userController.getAllReelsOfUser);
    app.post(`${baseUrl}/create-reels`, upload.single('reel'), validator.createReelsValidate, userController.createReels);
    // like/comment post routes
    app.post(`${baseUrl}/like-reel`, validator.likePostValidate, userController.likePost);
    app.post(`${baseUrl}/dislike-reel`, validator.dislikePostValidate, userController.dislikePost);
    app.post(`${baseUrl}/comment-reel`, validator.commentPostValidate, userController.commentPost);
    app.get(`${baseUrl}/delete-all-reel`, userController.deleteAllReels);
    app.get(`${baseUrl}/get-game-list`, userController.getGameList);
    app.post(`${baseUrl}/get-position-list`, validator.getPostionValidate, userController.getPositionsList);
    app.post(`${baseUrl}/update-profile`, validator.updateProfileValidate, userController.updateProfile);
    app.post(`${baseUrl}/add-game`, validator.addGameValidate, userController.addGame);
    app.post(`${baseUrl}/add-position`, validator.addPositionValidate, userController.addPosition);
    app.post(`${baseUrl}/add-group`, validator.addGroupValidate, userController.addGroup);
    app.get(`${baseUrl}/get-user-groups`, validator.getUserGroupListValidate,  userController.getUserGroupList);
    app.post(`${baseUrl}/upload-match`, upload.single('match'), validator.createReelsValidate, userController.addMatches);
    app.get(`${baseUrl}/get-user-matches`, validator.getUserGroupListValidate,  userController.getUserMatches);
    app.get(`${baseUrl}/get-user-profile`, validator.getUserGroupListValidate,  userController.getUserProfileData);
    app.get(`${baseUrl}/get-explore`, validator.getUserGroupListValidate,  userController.getExplore);
};