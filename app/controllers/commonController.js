const response = require('./../libs/responseLib')
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


const getUserById = async(user_id) => {
    return await UserModel.findOne({ _id : new mongoose.Types.ObjectId(user_id), status : 'active' }).lean();
}

const addChat = async(chatdata) => {
    let newChat = new chatModel(chatdata);
    await newChat.save();
}

module.exports = {
    getUserById : getUserById,
    addChat : addChat,
}