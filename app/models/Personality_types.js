'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const { generatePassword } = require('../libs/otpLib');
const timeLib = require('../libs/timeLib');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let personalityTypesSchema = new Schema({
  personality_type_name: {
    type: String,
    required: true
  },
  status :{
    type:String,
    default: "active"
  },
  created_on :{
    type:String,
    default: timeLib.getLocalTime()
  }
})


mongoose.model('Personality_types', personalityTypesSchema);