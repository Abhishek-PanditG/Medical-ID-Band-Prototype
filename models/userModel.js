const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
  allergies: String,
  emergencyContact: String,
  qrCodePath: String
});

module.exports = mongoose.model('User', userSchema);
