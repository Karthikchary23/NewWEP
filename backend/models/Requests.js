const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    customeremail: { type: String, required: true },
    serviceType: { type: String, required: true },
    provideremail: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Assigned", "Completed"], default: "Pending" },

    customerLocation: {  // ✅ Customer's real-time location
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { 
            type: [Number], 
            default: [0, 0],  // ✅ Default coordinates
            required: true 
        }
    },

    providerLocation: {  // ✅ Service provider's real-time location
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { 
            type: [Number], 
            default: [0, 0],  // ✅ Default coordinates
            required: true 
        }
    },

    customerAddress: { type: String, required: true },
    providerAddress: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
