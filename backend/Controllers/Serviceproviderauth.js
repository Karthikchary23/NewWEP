const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const ServiceProvider = require('../models/Serviceprovider'); // Add this line

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
      profileImage
    });
    console.log(newServiceProvider);
    await newServiceProvider.save();
    res.status(201).json({ message: "Service provider registered successfully" }); // Add this line
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

