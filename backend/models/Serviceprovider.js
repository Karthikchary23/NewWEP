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
        minlength: 10,
        maxlength: 10
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
    isServiceProvider: {
        type: Boolean,
        required: true,
        default: true
    },
    accountVerificationOTP: {
        type: Number
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
    serviceRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceRequest' 
    }],
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { 
          type: [Number], 
          default: [0, 0],  // ✅ Set default coordinates
          required: true 
      }
  },
  isAvailable: { // ✅ New field to track availability
    type: Boolean,
    default: true // Providers are available by default
}
});

// ✅ Enable geospatial indexing
serviceProviderSchema.index({ currentLocation: "2dsphere" });

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
module.exports = ServiceProvider;
