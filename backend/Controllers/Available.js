const mongoose = require('mongoose');
const ServiceProvider = require('../models/Serviceprovider'); // Ensure this path is correct

exports.UpdateAvailablestatus = async (req, res) => {
    const { email } = req.body;
    console.log("Email inside the status:", email);

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const serviceprovider = await ServiceProvider.findOne({ email });

        if (!serviceprovider) {
            return res.status(404).json({ message: 'Service provider not found' });
        }

        // Toggle the isAvailable status
        serviceprovider.isAvailable = !serviceprovider.isAvailable;

        await serviceprovider.save();

        res.status(200).json({ message: 'Availability status updated successfully', isAvailable: serviceprovider.isAvailable });
    } catch (error) {
        console.error('Error updating availability status:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};