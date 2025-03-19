require('dotenv').config();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ServiceProvider = require('../models/Serviceprovider');
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email
async function sendOtpEmail(email, otp) {
    console.log(email);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Ensure environment variables are set
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };


    try {
        
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send OTP email");
    }
}

// Main function to handle OTP generation, sending, and updating
async function ServiceprovideSignInOtpRequest(req, res) {
    const { email } = req.body;
    console.log(email);

    try {
        const existingUser = await ServiceProvider.findOne({ email})
       
        console.log("Existing user:");
        console.log(existingUser);
        

        if (!existingUser ) {
            return res.status(400).json({ message: ' email Id not found, please Sign up first ' });
        }

        console.log("User  exist, sending OTP...");

        // Generate OTP
        const otp = generateOtp();
        console.log("Generated OTP:", otp);

        // Send OTP via email
        try {
            await sendOtpEmail(email, otp);
        } catch (error) {
            return res.status(500).json({ message: 'Error sending OTP', error: error.message });
        }
        console.log("sending")

        res.status(200).json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        console.error("Database error:", error);
        console.error(error)
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports = {
    ServiceprovideSignInOtpRequest
};
