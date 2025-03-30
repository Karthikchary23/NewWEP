const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    customername: { type: String, required: true }, 
    customermail: { type: String, required: true }, 
    servicetype: { type: String, required: true }, 
    otp: { type: Number, required: false }, 


    serviceprovidername: { type: String, required: true }, 
    serviceprovideremail: { type: String, required: true },

    customerLocation: {  
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },

    serviceproviderlocation: {  
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },

    status: { type: String, enum: ["Pending", "Assigned", "Completed"], default: "Pending" },
    
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Request", requestSchema);
