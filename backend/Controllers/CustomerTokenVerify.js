const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const customer = require('../models/Customermodel');
dotenv.config();

exports.CustomerTokenverifcation = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'Token not found' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const customerfound = await customer.findOne({ email: decoded.email });
        if (!customerfound) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Token verified' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}