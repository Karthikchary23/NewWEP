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
            console.log("data of registerd",data)
            const { email, serviceType } = data;
            serviceProviders[socket.id] = { email, serviceType };
            // console.log("Registered providers:", serviceProviders);
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
