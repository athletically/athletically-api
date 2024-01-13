'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let positionSchema = new Schema({
  name: {
    type: String,
    default: '',
    unique : true
  },
  game_id: {
    type: mongoose.Types.ObjectId,
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


mongoose.model('Position', positionSchema);