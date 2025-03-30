const express = require("express");
const router = express.Router();
const Request = require("../models/Requests"); // Import your model

exports.Updaterequest = async (req, res) => {
  try {
    const {
      customermail,
      serviceprovideremail,
      customername,
      customerlocation,
      servicetype,
      serviceprovidername,
      serviceproviderlocation,
    } = req.body;

    // Check if a request with the same customer and provider exists
    let existingRequest = await Request.findOne({
      customermail: customermail,
      serviceprovideremail: serviceprovideremail,
    });

    if (!existingRequest) {
      // Generate a 6-digit random OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Generated OTP:", otp);

      // If request does not exist, create a new one
      const newRequest = new Request({
        customermail: customermail,
        serviceprovideremail: serviceprovideremail,
        customername: customername,
        servicetype: servicetype,
        serviceprovidername: serviceprovidername,
        status: "Pending",
        customerLocation: {
          lat: customerlocation.lat, // ✅ Corrected access
          lng: customerlocation.lng, // ✅ Corrected access
        },
        serviceproviderlocation: {
          lat: serviceproviderlocation.lat, // ✅ Corrected access
          lng: serviceproviderlocation.lng, // ✅ Corrected access
        },
        otp: otp, // Store the generated OTP in the request
      });

      await newRequest.save();
      res.status(200).json({
        message: "New request created successfully",
        newRequest,
      });
    } else {
      res.status(400).json({ message: "Request already exists" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.Deleterequest = async (req, res) => {
    try {
      const { customermail, serviceprovideremail } = req.body;
  
      // Find and delete the request
      let existingRequest = await Request.findOneAndDelete({
        customermail: customermail,
        serviceprovideremail: serviceprovideremail,
      });
  
      if (existingRequest) {
        // If the request was found and deleted
        res.status(200).json({
          message: "Request deleted successfully",
          deletedRequest: existingRequest,
        });
      } else {
        // If no matching request was found
        res.status(404).json({ message: "Request not found" });
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };