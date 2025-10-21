const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  mobile: { type: String, required: true, unique: true },

  email: { type: String, required: true, unique: true },

  mpin: { type: String, required: true },

});

module.exports = mongoose.model('User', UserSchema);