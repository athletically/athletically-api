'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let commentSchema = new Schema({
  comment_by: {
    type: mongoose.Types.ObjectId,
  },
  reel_id: {
    type: mongoose.Types.ObjectId,
  },
  comment: {
    type: String,
    default: ''
  },
  created_on :{
    type:Date,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('Comment', commentSchema);