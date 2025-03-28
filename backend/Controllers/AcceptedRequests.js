const Request = require("../models/Requests"); // Import your model
const ServiceProvider = require('../models/Serviceprovider');

exports.AcceptedRequests = async (req, res) => {
    try {
        console.log("testing", req.query);
        const customerEmail = req.query.customerEmail;
        const serviceProviderEmail = req.query.providerEmail;

        if (!customerEmail || !serviceProviderEmail) {
            return res.status(400).json({ message: "Both customerEmail and serviceProviderEmail are required" });
        }

        // Fetch a single request for the given customerEmail and serviceProviderEmail
        const request = await Request.findOne({
            customermail: customerEmail,
            serviceprovideremail: serviceProviderEmail
        });

        if (!request) {
            return res.status(404).json({ message: "No request found for the given customerEmail and serviceProviderEmail" });
        }

        const { servicetype, status, createdAt } = request;

        // Fetch the service provider details
        const serviceProvider = await ServiceProvider.findOne({ email: serviceProviderEmail });

        if (!serviceProvider) {
            return res.status(404).json({ message: "Service provider not found" });
        }

        // Extract the required fields
        const { firstName, lastName, mobile, ratings, serviceType } = serviceProvider;

        // Format the createdAt field into an easily sortable format (ISO string)
        const requestAcceptedTimeAndDate = new Date(createdAt).toISOString();

        // Format the result
        const formattedResult = {
            ServiceType: serviceType,
            Name: `${firstName} ${lastName}`,
            Mobile: mobile,
            Ratings: ratings,
            Status: status,
            RequestAcceptedTimeAndDate: requestAcceptedTimeAndDate
        };
        console.log(formattedResult);
        // Send the formatted result as the response
        res.status(200).json(formattedResult);
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};