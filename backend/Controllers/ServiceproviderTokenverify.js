const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Serviceprovider = require('../models/Serviceprovider');
dotenv.config();

exports.ServiceproviderTokenverifcation = async (req, res) => {
    const { token } = req.body;
    // console.log(token);
    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoding");
        // console.log(decoded);
        const serviceprovider = await Serviceprovider.findOne({ email: decoded.email });
        if (!serviceprovider) {
            return res.status(400).json({ message: 'Serviceprovider not found' });
        }
        res.status(200).json({ message: 'Token verified',firstName:serviceprovider.firstName });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}