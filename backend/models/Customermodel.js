const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    Fulladdress: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    isCustomer: { type: Boolean, required: true, default: true },
    resetPasswordOTP: { type: Number },
    customerVerificationOTP: { type: Number },
    ratings: { type: Number, default: 0 },
    serviceProvidedCount: { type: Number, default: 0 },
    serviceRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest" }],

    currentLocation: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { 
            type: [Number], 
            default: [0, 0],  // ✅ Set default coordinates
            required: true 
        }
    }
});

// ✅ Enable Geospatial Index
CustomerSchema.index({ currentLocation: "2dsphere" });

const Customer = mongoose.model("Customer", CustomerSchema);
module.exports = Customer;
