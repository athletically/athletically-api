'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const { string } = require('joi');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  password: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: ''
  },
  name : {
    type: String,
    default : ''
  },
  created_on :{
    type:String,
    default: timeLib.getLocalTime()
  },
  updated_on :{
    type:String,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('User', userSchema);