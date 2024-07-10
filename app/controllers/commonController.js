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
const { object, func } = require('joi');
const { group } = require('console');
const { getPositionsList } = require('./userController');
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

const getUserGroups = async(userId) => {
    try {
        let groups = await userGroupMappingTable.find({ user_id : userId, status : 'active' });
        let returndata = [];
        if(groups.length < 1) return returndata;
        groups.map((group) => {
            returndata.push(group.group_id);
        })
        return returndata;
    } catch (error) {
        console.log("unable to get user Groups for user ", userId);
        return [];
    }
}


function getContentType(fileName) {
    const mimeTypes = {
      '.aac': 'audio/aac',
      '.abw': 'application/x-abiword',
      '.arc': 'application/x-freearc',
      '.avi': 'video/x-msvideo',
      '.azw': 'application/vnd.amazon.ebook',
      '.bin': 'application/octet-stream',
      '.bmp': 'image/bmp',
      '.bz': 'application/x-bzip',
      '.bz2': 'application/x-bzip2',
      '.cda': 'application/x-cdf',
      '.csh': 'application/x-csh',
      '.css': 'text/css',
      '.csv': 'text/csv',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.eot': 'application/vnd.ms-fontobject',
      '.epub': 'application/epub+zip',
      '.gz': 'application/gzip',
      '.gif': 'image/gif',
      '.htm': 'text/html',
      '.html': 'text/html',
      '.ico': 'image/vnd.microsoft.icon',
      '.ics': 'text/calendar',
      '.jar': 'application/java-archive',
      '.jpeg': 'image/jpeg',
      '.jpg': 'image/jpeg',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.jsonld': 'application/ld+json',
      '.mid': 'audio/midi audio/x-midi',
      '.midi': 'audio/midi audio/x-midi',
      '.mjs': 'text/javascript',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.mpeg': 'video/mpeg',
      '.mpkg': 'application/vnd.apple.installer+xml',
      '.odp': 'application/vnd.oasis.opendocument.presentation',
      '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
      '.odt': 'application/vnd.oasis.opendocument.text',
      '.oga': 'audio/ogg',
      '.ogv': 'video/ogg',
      '.ogx': 'application/ogg',
      '.opus': 'audio/opus',
      '.otf': 'font/otf',
      '.png': 'image/png',
      '.pdf': 'application/pdf',
      '.php': 'application/x-httpd-php',
      '.ppt': 'application/vnd.ms-powerpoint',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      '.rar': 'application/vnd.rar',
      '.rtf': 'application/rtf',
      '.sh': 'application/x-sh',
      '.svg': 'image/svg+xml',
      '.swf': 'application/x-shockwave-flash',
      '.tar': 'application/x-tar',
      '.tif': 'image/tiff',
      '.tiff': 'image/tiff',
      '.ts': 'video/mp2t',
      '.ttf': 'font/ttf',
      '.txt': 'text/plain',
      '.vsd': 'application/vnd.visio',
      '.wav': 'audio/wav',
      '.weba': 'audio/webm',
      '.webm': 'video/webm',
      '.webp': 'image/webp',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.xhtml': 'application/xhtml+xml',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xml': 'application/xml',
      '.xul': 'application/vnd.mozilla.xul+xml',
      '.zip': 'application/zip',
      '.3gp': 'video/3gpp',
      '.3g2': 'video/3gpp2',
      '.7z': 'application/x-7z-compressed'
    };
  
    const ext = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1).toLowerCase();
    return mimeTypes['.' + ext] || 'application/octet-stream';
}

async function getAllUsers(search, filter, sort) {
    let match = {}
    if(search)
        match.name = new RegExp(`^${search}`, 'i');
    if(filter)
        match.game = filter

    console.log(match);
    let AllUsers = await UserModel.find(match, '-password').lean();

    let users = [];
    await Promise.all(AllUsers.map(async(user) => {
        user.sports = await getSportById(user.game);
        user.role = await getPositionsById(user.position);
        delete user.password;
        users.push(user);
    }))

    return users;
}

async function getSportById(game) {
    if(!isValidMongoId(game))
        return "--";
    let sport = await gameModel.findById(game);
    return sport.name;
}

async function getPositionsById(position) {
    if(!isValidMongoId(position))
        return "--";
    let pos = await positionModel.findById(position);
    return pos.name;
}

function isValidMongoId(id) {
    const { ObjectId } = require('mongodb');
    return ObjectId.isValid(id);
}

module.exports = {
    getUserById : getUserById,
    addChat : addChat,
    getUserGroups : getUserGroups,
    getContentType : getContentType,
    getAllUsers : getAllUsers
}