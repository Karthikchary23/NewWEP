const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    priceRange: {
        type: String,
    },
    serviceProviders: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ServiceProvider' 
    }] 
});

const Service = mongoose.model('Service', ServiceSchema);
module.exports = Service;
