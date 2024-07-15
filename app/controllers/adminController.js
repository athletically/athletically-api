const response = require('../libs/responseLib')
const check = require('../libs/checkLib');
const fs = require('fs');
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
const AWS = require('aws-sdk');
const path = require('path');
const { tryCatch } = require('bull/lib/utils');
const { object } = require('joi');
const postModel = mongoose.model('Post');
const likeModel = mongoose.model('Like');
const commentModel = mongoose.model('Comment');
const gameModel = mongoose.model('Game');
const positionModel = mongoose.model('Position');
const userGroupMappingTable = mongoose.model('Group_user_mapping');
const chatModel = mongoose.model('Chat');
const groupModel = mongoose.model('Group');
const followModel = mongoose.model('Follow');
const eventModel = mongoose.model('Event');
const orgTypeModel = mongoose.model('Org_type');
const personalityTypeModel = mongoose.model('Personality_types');
const commonController = require('./commonController');
const DEFAULT_USER_IMAGE = "https://st3.depositphotos.com/6672868/13701/v/380/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

AWS.config.update({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const getAllUsers = async(req, res) => {
    try {
        
        let search = req.query.search;
        let filter = req.query.filter;
        let sort = req.query.sort;

        const users =  await commonController.getAllUsers(search, filter, sort);

        let apiResponse = response.generate(false, 'Users found', users);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const getGameList = async(req, res) => {
    try {
        
        const gameList = await gameModel.find({status : 'active'}, '_id name');

        let apiResponse = response.generate(false, 'Games found', gameList);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const getUserDetails = async(req, res) => {
    try {
        const userDtls = await UserModel.findById(req.query.user_id).lean();
        let apiResponse;
        if(userDtls){
            userDtls.sports = await commonController.getSportById(userDtls.game);
            userDtls.role = await commonController.getPositionsById(userDtls.position);
            apiResponse = response.generate(false, 'User found', userDtls);
        }
        else
            apiResponse = response.generate(false, 'User Not found', {});
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const updateUser = async(req, res) => {
    try {
        let apiResponse;
        let user = req.body.user;
        let newScore = user.score;
        let user_id = user._id;

        let isUpdated = await UserModel.findByIdAndUpdate(user_id, { score : newScore });

        if(isUpdated)
            apiResponse = response.generate(false, 'User Updated', {});
        else
            apiResponse = response.generate(true, 'User not updated', {});

            res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const getAllReels = async(req, res) => {
    try {
        
        let search = req.query.search;
        let filter = req.query.filter;
        let sort = req.query.sort;

        const reels =  await commonController.getAllReels(search, filter, sort);

        let apiResponse;

        if(reels.length > 0)
            apiResponse = response.generate(false, 'Reels found', reels);
        else
            apiResponse = response.generate(false, 'Reels not found', []);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const updateReel = async(req, res) => {
    try {
        let apiResponse;
        let reel_id = req.body.reel_id;
        let status = req.body.status;

        let isUpdated = await postModel.findByIdAndUpdate(reel_id, { status : status });

        if(isUpdated)
            apiResponse = response.generate(false, 'Reel Updated', {});
        else
            apiResponse = response.generate(true, 'Reel not updated', {});

            res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

module.exports = {
    getAllUsers: getAllUsers,
    getGameList: getGameList,
    getUserDetails: getUserDetails,
    updateUser: updateUser,
    getAllReels: getAllReels,
    updateReel: updateReel
}