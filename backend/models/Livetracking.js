const mongoose = require('mongoose');

const LiveTrackingSchema = new mongoose.Schema({
    serviceProviderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceProvider', 
        required: true 
    },
    latitude: { 
        type: Number, 
        required: true 
    },
    longitude: { 
        type: Number, 
        required: true 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
});

const LiveTracking = mongoose.model('LiveTracking', LiveTrackingSchema);
module.exports = LiveTracking;
