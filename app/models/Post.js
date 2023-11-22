'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let postSchema = new Schema({
  user_id: {
    type: String,
    default: ''
  },
  reel_link: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  },
  status:{
    type: String,
    default : 'active'
  },
  created_on :{
    type:Date,
    default:""
  }
})


mongoose.model('Post', postSchema);