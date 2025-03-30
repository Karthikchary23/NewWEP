const { Server } = require("socket.io");

let io;
const serviceProviders = {}; 
function init(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        // console.log("New provider connected:", socket.id);

        // Register service provider when they connect
        socket.on("registerServiceProvider", (data) => {
            console.log("data of registered", data);
            const { email, serviceType } = data;

            // Save the service provider's details
            serviceProviders[socket.id] = { email, serviceType };

            // Join a room with the service provider's email
            socket.join(email);

            console.log(`Service provider ${email} joined their room`);
        });

        socket.on("registerCustomer", (customerEmail) => {
            socket.join(customerEmail);
            console.log(`Customer ${customerEmail} joined their room`);
          });
          
        socket.on("serviceAccepted", (data) => {
            console.log("Service Accepted now:", data);
            console.log("types of data is ",typeof(data))
            io.to(data.customerEmail).emit("notification", data); 
          });

        socket.on("cancelRequest", (data) => {
            const { customerEmail, providerEmail } = data;
            console.log("Cancel request received:", data);
          
            // Notify the customer if the service provider cancels
            if (customerEmail) {
                console.log("Notifying customer:", customerEmail);
                io.to(customerEmail).emit("requestCanceledbyprovider", { providerEmail });
            }
          
            // Notify the service provider if the customer cancels
            if (providerEmail) {
                console.log("Notifying provider:", providerEmail);
                io.to(providerEmail).emit("requestCanceledbycutomer", { customerEmail });
            }
          
            console.log("Request canceled:", data);
          });

        // Remove provider when they disconnect
        socket.on("disconnect", () => {
            console.log("Provider disconnected:", socket.id);
            delete serviceProviders[socket.id];
        });
    });
}

function getIo() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}

function getServiceProviders() {
    return serviceProviders;
}

// ✅ Make sure we export everything correctly
module.exports = { init, getIo, getServiceProviders };
