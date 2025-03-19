const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    serviceType: { type: String, required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider" },
    status: { type: String, enum: ["Pending", "Assigned", "Completed"], default: "Pending" },
    customerLocation: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
