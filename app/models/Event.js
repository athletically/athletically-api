'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let eventSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  event_title: {
    type: String,
    required: true
  },
  event_desc: {
    type: String,
    required: true
  },
  event_for: {
    type: String,
    required: true
  },
  coached_by: {
    type: String,
    default : 0
  },
  scouted_by: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    required: true
  },
  map_link: {
    type: String,
    required: true
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


mongoose.model('Event', eventSchema);