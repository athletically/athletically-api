'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
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
  image: {
    type: String,
    default: "https://st3.depositphotos.com/6672868/13701/v/380/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
  },
  name : {
    type: String,
    default : ''
  },
  dob : {
    type: String,
    default : ''
  },
  height : {
    type: String,
    default : ''
  },
  width : {
    type: String,
    default : ''
  },
  country : {
    type: String,
    default : ''
  },
  city : {
    type: String,
    default : ''
  },
  competition_won : {
    type: Array,
    default : []
  },
  previous_teams : {
    type: Array,
    default : []
  },
  previous_coaches : {
    type: Array,
    default : []
  },
  user_type:{
    type: Number,
    default:1
  },
  created_on :{
    type:Date,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('User', userSchema);