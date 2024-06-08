const fs = require('fs');
const os = require('os');
const path = require('path');
const userController = require('../controllers/userController');
const appConfig = require("./../../config/appConfig");
const auth = require('./../middlewares/auth');
const validator = require('../middlewares/validator');
const multer = require('multer');

// Configure multer for handling form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const storagLarge = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir()); // Store files in the system's temporary directory
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`);
    }
});

const uploadLarge = multer({ storage: storagLarge });

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.get(`${baseUrl}/`, userController.test);
    app.post(`${baseUrl}/login`, validator.loginValidate, userController.login);
    app.post(`${baseUrl}/register`, validator.registerValidate, userController.register);
    app.post(`${baseUrl}/send-otp`,  validator.sendMailForgotPasswordValidate, userController.sendOtpForgotPassword);
    app.post(`${baseUrl}/verify-otp`, validator.verifyOTPvalidate, userController.verifyOTP);
    app.post(`${baseUrl}/reset-password`,  validator.resetPasswordvalidate, userController.resetPassword);
    app.get(`${baseUrl}/get-all-reels`,  auth.isAuthorized, auth.isAuthorized, userController.getAllReels);
    // app.post(`${baseUrl}/get-homepage-reels`, validator.homepageReelsValidate, userController.homePageReels);
    app.get(`${baseUrl}/get-homepage-reels`,  auth.isAuthorized, userController.homePageReels);
    app.post(`${baseUrl}/get-user-reels`,  auth.isAuthorized, validator.getAllReelsOfUserValidate, userController.getAllReelsOfUser);
    app.post(`${baseUrl}/create-reels`,  auth.isAuthorized, upload.single('reel'), validator.createReelsValidate, userController.createReels);
    // like/comment post routes
    app.post(`${baseUrl}/like-reel`,  auth.isAuthorized, validator.likePostValidate, userController.likePost);
    app.post(`${baseUrl}/dislike-reel`,  auth.isAuthorized, validator.dislikePostValidate, userController.dislikePost);
    app.post(`${baseUrl}/comment-reel`,  auth.isAuthorized, validator.commentPostValidate, userController.commentPost);
    app.get(`${baseUrl}/delete-all-reel`,  auth.isAuthorized, userController.deleteAllReels);
    app.get(`${baseUrl}/get-game-list`,  auth.isAuthorized, userController.getGameList);
    app.post(`${baseUrl}/get-position-list`,  auth.isAuthorized, validator.getPostionValidate, userController.getPositionsList);
    app.post(`${baseUrl}/update-profile`,  auth.isAuthorized, uploadLarge.single('image'), validator.updateProfileValidate, userController.updateProfile);
    app.post(`${baseUrl}/add-game`,  auth.isAuthorized, validator.addGameValidate, userController.addGame);
    app.post(`${baseUrl}/add-position`,  auth.isAuthorized, validator.addPositionValidate, userController.addPosition);
    app.post(`${baseUrl}/add-group`,  auth.isAuthorized, validator.addGroupValidate, userController.addGroup);
    app.get(`${baseUrl}/get-user-groups`,  auth.isAuthorized, validator.getUserGroupListValidate,  userController.getUserGroupList);
    app.post(`${baseUrl}/upload-match`,  auth.isAuthorized, uploadLarge.single('match'), validator.createReelsValidate, userController.addMatches);
    app.get(`${baseUrl}/get-user-matches`,  auth.isAuthorized, validator.getUserGroupListValidate,  userController.getUserMatches);
    app.get(`${baseUrl}/get-user-profile`,  auth.isAuthorized, validator.getUserGroupListValidate,  userController.getUserProfileData);
    app.get(`${baseUrl}/get-explore`,  auth.isAuthorized, validator.getUserGroupListValidate,  userController.getExplore);
    app.post(`${baseUrl}/upload-podcast`,  auth.isAuthorized, uploadLarge.single('podcast'), validator.createReelsValidate, userController.addPodcast);
    app.get(`${baseUrl}/get-podcast`,  auth.isAuthorized, validator.getUserGroupListValidate,  userController.getPodcast);
    app.post(`${baseUrl}/update-reel-views`, auth.isAuthorized, validator.updateViewValidate, userController.updateView);
    app.post(`${baseUrl}/follow-user`, auth.isAuthorized, validator.followUserValidate, userController.followUser);
    app.post(`${baseUrl}/get-leaderboard`, auth.isAuthorized, validator.getLeaderboardValidate, userController.getLeaderboard);
    app.post(`${baseUrl}/add-event`, auth.isAuthorized, validator.addEventValidator, userController.addEvent);
    app.post(`${baseUrl}/get-events`, auth.isAuthorized, validator.getEventsValidator, userController.getEvents);
    app.post(`${baseUrl}/edit-event`, auth.isAuthorized, validator.editEventValidator, userController.editEvent);
    app.post(`${baseUrl}/delete-event`, auth.isAuthorized, validator.deleteEventValidator, userController.deleteEvent);
    app.get(`${baseUrl}/get-types-list`,  auth.isAuthorized,  userController.getOtherPersonalityTypeList);
    app.get(`${baseUrl}/get-org-types`,  auth.isAuthorized,  userController.getOrgTypes);
    app.get(`${baseUrl}/get-videos`, auth.isAuthorized, validator.getVideosValidate, userController.getVideos);
    app.get(`${baseUrl}/get-user-groups-connect`, auth.isAuthorized, userController.getGroupsOfUser);
    app.get(`${baseUrl}/validate-token`, validator.validateTokenValidate, userController.validateToken);
    app.get(`${baseUrl}/get-previous-chats`, auth.isAuthorized, validator.getPreviousChatByGroupIdValidate, userController.getPreviousChatByGroupId);
    app.get(`${baseUrl}/get-users-of-group`, auth.isAuthorized, validator.getPreviousChatByGroupIdValidate, userController.getUsersOfByGroupId);
    app.post(`${baseUrl}/upload-chat-file`,  auth.isAuthorized, uploadLarge.single('file'), userController.uploadChatFiles);
};