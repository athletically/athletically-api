'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let followSchema = new Schema({
  followed_user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  follower_user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  status:{
    type: String,
    default : 'active',
    enum : ['active', 'inactive', 'delete']
  },
  created_on :{
    type:Date,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('Follow', followSchema);