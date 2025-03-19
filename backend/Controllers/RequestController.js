const Request = require("../models/Requests");
const ServiceProvider = require("../models/Serviceprovider");

const io = require("../socket"); // Import socket connection
const { getIO, getIo } = require("../socket");

exports.createRequest = async (req, res) => {
    console.log("Request body:", req.body);
    try {
        const { customerId, serviceType, latitude, longitude } = req.body;
        
        if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
            return res.status(400).json({ message: "Invalid latitude or longitude" });
        }

        const customerLocation = [longitude, latitude];

        // Find available service providers nearby
        const providers = await ServiceProvider.find({
            serviceType,
            isAvailable: true,
            currentLocation: {
                $near: {
                    $geometry: { type: "Point", coordinates: customerLocation },
                    $maxDistance: 5000, // 5 km search radius
                },
            },
        });
        console.log(providers)

        if (!providers || providers.length === 0) {
            console.log("No")
            return res.status(404).json({ message: "No providers available nearby" });
        }

        // Emit event to all available providers
        io.getIO().emit("newRequest", {
            customerId,
            serviceType,
            customerLocation,
            requestTime: new Date(),
        });
        console.log("request sent")

        res.status(200).json({ message: "Request sent to nearby providers" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
};

// // Handle provider accepting request
// exports.acceptRequest = async (req, res) => {
//     try {
//         const { providerId, customerId } = req.body;
//         console.log(req.body)

//         const provider = await ServiceProvider.findById(providerId);
//         if (!provider || !provider.isAvailable) {
//             return res.status(400).json({ message: "Provider not available" });
//         }

//         // Create request and assign provider
//         const newRequest = new Request({
//             customerId,
//             serviceType: provider.serviceType,
//             providerId,
//             status: "Assigned",
//             customerLocation: provider.currentLocation,
//         });

//         await newRequest.save();

//         // Mark provider as unavailable
//         provider.isAvailable = false;
//         await provider.save();

//         // Notify other providers that request is taken
//         io.getIO().emit("requestTaken", { customerId });

//         res.status(200).json({ message: "Request assigned", request: newRequest });

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.requestService = async (req, res) => {
    const { name, email, latitude, longitude, serviceType } = req.body;
    console.log("kkk",req.body)

    // Create a new service request (you can save it to the database if needed)
    const request = {
        customerId: email,
        serviceType,
        customerLocation: [latitude, longitude]
    };
    const io = getIo();
    console.log(request)
    io.emit("newServiceRequest", request);

    res.status(200).json({ message: "Service request sent successfully" });
};

