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
  score: {
    type: Number,
    default : 0
  },
  user_type:{
    type: String,
    enum: ["player", "other", "team", "orgs"],
    default:"player"
  },
  awards : {
    type: Array,
    default : []
  },
  medals : {
    type: Array,
    default : []
  },
  clubs : {
    type: Array,
    default : []
  
  },
  coaches : {
    type: Array,
    default : []
  },
  age : {
    type: String,
    default : ""
  },
  certification : {
    type: Array,
    default : []
  },
  home_ground : {
    type: String,
    default : ""
  },
  map_link : {
    type: String,
    default : ""
  },
  team_size : {
    type: Number,
    default : 0
  },
  managements : {
    type: Array,
    default : []
  },
  coaches : {
    type: Array,
    default : []
  },
  other_stuffs : {
    type: Array,
    default : []
  },
  players : {
    type: Array,
    default : []
  },
  titles : {
    type: Array,
    default : []
  },
  alumni_players : {
    type: Array,
    default : []
  },
  active_competition : {
    type: Array,
    default : []
  },
  org_type : {
    type: String,
    default : ""
  },
  desc : {
    type: String,
    default : ""
  },
  estd:{
    type: String,
    default:""
  },
  key_personalities : {
    type: Array,
    default : []
  },
  type : {
    type: String,
    default: ""
  },
  game : {
    type: String,
    default : ""
  },
  position : {
    type: String,
    default : ""
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