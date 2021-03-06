const mongoose = require('mongoose');

//Create Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  data: {
    type: Date,
    default: Date.now
  }

});

const User = mongoose.model('User', userSchema);
module.exports = User;