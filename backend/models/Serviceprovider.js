const mongoose = require('mongoose');
const serviceProviderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
    length: 10
  },
  address: {
    type: String,
  },
  localArea: {
    type: String,
  },
  ratings: {
    type: Number,
    default: 0
  },
  serviceType: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  accountVerificationOTP: {
    type: Number
  },
  accountVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordOTP: {
    type: Number
  },
  customerVerificationOTP: {
    type: Number
  },
  serviceProvidedCount: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String,
    required: true
  },
  serviceprovider:{
    type: Boolean,
    default: true
  },
  serviceprovider:{
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);