const mongoose = require('mongoose');
const Serviceprovider = require('../models/Serviceprovider');
exports.ServiceProvicerlocationUpdate = async (req, res) => {
    const { email, latitude, longitude } = req.body;

    console.log(latitude, longitude, email);

    if (!email || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: 'Email, latitude, and longitude are required' });
    }

    try {
        const sp = await Serviceprovider.findOneAndUpdate(
            { email },
            { 
                $set: { 
                    "currentLocation.type": "Point",
                    "currentLocation.coordinates": [longitude, latitude] 
                }
            },
            { new: true }  
        );

        if (!sp) {
            return res.status(404).json({ message: 'Service Provider not found' });
        }

        res.status(200).json({ message: 'Location updated successfully', sp });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
