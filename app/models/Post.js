'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let postSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
  },
  reel_link: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default : 0
  },
  comments: {
    type: Number,
    default : 0
  },
  type: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
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


mongoose.model('Post', postSchema);