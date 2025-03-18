const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const ServiceProvider = require('../models/Serviceprovider'); // Import the model

exports.Servicesignup = async (req, res) => {
  const { firstName, lastName, email, mobile, address, localArea, serviceType, password, profileImage } = req.body;
  console.log(req.body);
  
  try {
    const serviceProvider = await ServiceProvider.findOne({ email });
    if (serviceProvider) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newServiceProvider = new ServiceProvider({
      firstName,
      lastName,
      email,
      mobile,
      address,
      localArea,
      serviceType,
      password: hashedPassword,
    });

    console.log(newServiceProvider);
    await newServiceProvider.save();

    console.log("success"); // ✅ Fixed typo here
    res.status(200).json({ message: "Service provider registered successfully" }); // Response to client
  } catch (error) {
    console.error("Error:", error); // Log full error details

    res.status(500).json({ message: "Something went wrong" });
  }
};
