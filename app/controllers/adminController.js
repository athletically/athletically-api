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
const AdminsModel = mongoose.model('Admins');
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

const getAllGroups = async(req, res) => {
    try {
        
        let search = req.query.search;
        let filter = req.query.filter;
        let sort = req.query.sort;

        const groups =  await commonController.getAllGroups(search, filter, sort);

        let apiResponse;

        if(groups.length > 0)
            apiResponse = response.generate(false, 'Groups found', groups);
        else
            apiResponse = response.generate(false, 'Groups not found', []);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const addGroup = async(req, res) => {
    try{
        const newGroup = new groupModel({
            game_id : req.body.game_id,
            position_id : req.body.position_id,
            name : req.body.name
        })
        await newGroup.save();

        let apiResponse = response.generate(false, 'Added Successfully', {});
        res.status(200).send(apiResponse);
    }
    catch(error){
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const getPositionList = async(req, res) => {
    try {
        
        const game_id = req.query.game_id;
        const match = {};
        if(game_id)
            match.game_id = game_id;
        match.status = 'active';

        const positionList = await positionModel.find(match, '_id name');

        let apiResponse = response.generate(false, 'Positions found', positionList);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const modifyGroup = async(req, res) => {
    try {
        let apiResponse;
        let group_id = req.body.group_id;
        let status = req.body.status;
        let name = req.body.name;

        const match = {};

        if(name)
            match.name = name;
        if(status)
            match.status = status;

        let isUpdated = await groupModel.findByIdAndUpdate(group_id, match);

        if(isUpdated)
            apiResponse = response.generate(false, 'Group Updated', {});
        else
            apiResponse = response.generate(true, 'Group not updated', {});

        console.log(isUpdated);

            res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const getGroupDetails = async(req, res) => {
    try {
        const groupDtls = await groupModel.findById(req.query.group_id).lean();
        let apiResponse;
        if(groupDtls){
            apiResponse = response.generate(false, 'Group found', groupDtls);
        }
        else
            apiResponse = response.generate(false, 'Group Not found', {});
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const adminLogin = async(req, res) => {
    try {
        const { username, password } = req.body;

        let finduser = await AdminsModel.findOne({ username: username }).select('-__v').lean();

        if (check.isEmpty(finduser)) {
            res.status(404);
            throw new Error('User not Registered!');
        };
        // if ((finduser.google_token != '') || (await passwordLib.verify(req.body.password, finduser.password))) {   
        if(finduser.password === password){
            console.log('verified!');
            if (!finduser.is_active) {
                res.status(401);
                throw new Error('Authorization Failed!');
            } else {
                let payload = {
                    user_id : finduser._id,
                    name: finduser.name,
                    username: finduser.username,
                    token: await tokenLib.generateToken(finduser)
                };
                let apiResponse = response.generate(false, 'logged in!', payload);
                res.status(200).send(apiResponse);
            }
        } else {
            res.status(401);
            throw new Error('incorrect password!');
        }
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const getGames = async(req, res) => {
    try {
        const {search, filter} = req.query;
        const match = {};

        if(search)
            match.name = { $regex: search, $options: "i" };
        if(filter)
            match.status = filter;

        const gameList = await gameModel.find(match);
        let apiResponse;
        if(gameList.length > 0){
            apiResponse = response.generate(false, 'Game List', gameList);
        }
        else{
            apiResponse = response.generate(false, 'Games Not Found', []);
        }
        res.status(200).send(apiResponse);        
    } catch (error) {
        let apiResponse = response.generate(true, error.message, []);
        res.status(500).send(apiResponse);
    }
}

const addGame = async(req, res) => {
    try {
        let name = req.body.game_name;
        if(!name){
            let apiResponse = response.generate(true, "Game Name Cannot be empty", {});
            return res.status(200).send(apiResponse);
        }
        let existing = await gameModel.find({name});
        if(existing.length > 0){
            let apiResponse = response.generate(true, "Game Already Exist", {});
            return res.status(200).send(apiResponse);
        }
        const newGame = new gameModel({
            name : name
        });

        await newGame.save();
        let apiResponse = response.generate(false, "Game Added Successfully", newGame);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = response.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const modifyGame = async(req, res) => {
    try {
        let apiResponse;
        let game_id = req.body.game_id;
        let status = req.body.status;
        let name = req.body.game_name;

        if(!name){
            let apiResponse = response.generate(true, "Game Name Cannot be empty", {});
            return res.status(200).send(apiResponse);
        }
        let existing = await gameModel.find({name});
        
        if(existing.length > 0 && existing[0]._id.toString() !== game_id){
            let apiResponse = response.generate(true, "Game Already Exist", {});
            return res.status(200).send(apiResponse);
        }

        const match = {};

        if(name)
            match.name = name;
        if(status)
            match.status = status;

        let isUpdated = await gameModel.findByIdAndUpdate(game_id, match, { new : true });

        if(isUpdated)
            apiResponse = response.generate(false, 'game Updated', {});
        else
            apiResponse = response.generate(true, 'game not updated', {});

        console.log(isUpdated);

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
    updateReel: updateReel,
    getAllGroups: getAllGroups,
    addGroup: addGroup,
    getPositionList: getPositionList,
    modifyGroup: modifyGroup,
    getGroupDetails: getGroupDetails,
    adminLogin: adminLogin,
    addGame: addGame,
    getGames: getGames,
    modifyGame: modifyGame
}