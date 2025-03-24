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
            serviceproviderlocation 
        } = req.body;

        // Check if a request with the same customer and provider exists
        // let existingRequest = await Request.findOne({
        //     customermail: customermail,
        //     serviceprovideremail: serviceprovideremail,
        // });

        // if (existingRequest) {
        //     console.log("Request already exists");
        //     return res.json({ message: "Request already exists", existingRequest });
        // }

        // If request does not exist, create a new one
        const newRequest = new Request({
            customermail: customermail,
            serviceprovideremail: serviceprovideremail,
            customername: customername,
            servicetype: servicetype,
            serviceprovidername: serviceprovidername,
            status: "Pending",
            customerLocation: {
                lat: customerlocation.lat,  // ✅ Corrected access
                lng: customerlocation.lng   // ✅ Corrected access
            },
            serviceproviderlocation: {
                lat: serviceproviderlocation.lat,  // ✅ Corrected access
                lng: serviceproviderlocation.lng   // ✅ Corrected access
            }
        });

        // console.log(newRequest);

        await newRequest.save();
        res.status(200).json({ message: "New request created successfully", newRequest });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
