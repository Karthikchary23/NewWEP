const mongoose = require('mongoose');
const Customer = require('../models/Customermodel');

exports.CustomerlocationUpdate = async (req, res) => {
    const { email, latitude, longitude } = req.body;

    // console.log("sdfghj",latitude, longitude, email);

    if (!email || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ message: 'Email, latitude, and longitude are required' });
    }

    try {
        const customer = await Customer.findOneAndUpdate(
            { email },
            { 
                $set: { 
                    "currentLocation.type": "Point",
                    "currentLocation.coordinates": [longitude, latitude] 
                }
            },
            { new: true }  
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Location updated successfully', customer });
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
