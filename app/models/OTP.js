'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let otpSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  created_on :{
    type:Date,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('OTP', otpSchema);