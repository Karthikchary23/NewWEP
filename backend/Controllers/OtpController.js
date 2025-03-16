const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ServiceProvider = require('../models/Serviceprovider');
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email
async function sendOtpEmail(email, otp) {
    console.log(email)
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Replace with your email
            pass: process.env.EMAIL_PASS // Replace with your email password
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER, // Replace with your email
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };
    console.log(otp)

    await transporter.sendMail(mailOptions);
}



// Main function to handle OTP generation, sending, and updating
async function handleOtpRequest(req, res) {
    const { email, mobile } = req.body;

    try {
        const existingUser = await ServiceProvider.findOne({ $and: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = generateOtp();

        // Send OTP via email
        await sendOtpEmail(email, otp);

        

        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    handleOtpRequest
};