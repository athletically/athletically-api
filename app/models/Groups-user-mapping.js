'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let groupUserMappingSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  group_id: {
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


mongoose.model('Group_user_mapping', groupUserMappingSchema);