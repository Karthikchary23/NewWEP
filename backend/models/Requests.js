const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  serviceType: { type: String, required: true }, // Example: "Electrician"
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider" },
  status: { type: String, enum: ["Pending", "Assigned", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
