'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let chatSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  group_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  message:{
    type: String,
    default : ''
  },
  reply_to: {
    type: String,
    default: ""
  },
  status:{
    type: String,
    default : 'active'
  },
  created_on :{
    type:Date,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('Chat', chatSchema);