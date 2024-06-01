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
  sender_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  receiver_id: {
    type: String,
    default: ""
  },
  message_content:{
    type: String,
    default : ''
  },
  message_file_path:{
    type: String,
    default : ''
  },
  reply_to: {
    type: String,
    default: ""
  },
  read_status: {
    type: String,
    default: 1,
    enum : [1, 2, 3] // 1 = on the way | 2 = sent | 3 = read 
  },
  datetime : {
    type: String,
    default: new Date().getTime()
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