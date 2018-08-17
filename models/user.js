const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true
  },
  passwordHash: { 
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;