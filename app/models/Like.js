'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let likeSchema = new Schema({
  liked_by: {
    type: mongoose.Types.ObjectId,
  },
  reel_id: {
    type: mongoose.Types.ObjectId,
  },
  created_on :{
    type:Date,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('Like', likeSchema);