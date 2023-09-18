'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let userSchema = new Schema({
  username: {
    type: String,
    default: '',
    unique : true
  },
  password: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  is_active:{
    type: Boolean,
    default:true
  },
  user_type:{
    type: Number,
    default:1
  },
  created_on :{
    type:Date,
    default:""
  }
})


mongoose.model('User', userSchema);