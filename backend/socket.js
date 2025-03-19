const socketIo = require("socket.io");

let io;

exports.init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("joinServiceProvider", (email) => {
            console.log(`Service provider joined: ${email}`);
            socket.join(email);
        });

        socket.on("acceptRequest", (data) => {
            console.log(`Request accepted: ${data.requestId} by ${data.providerEmail}`);
            // Handle request acceptance logic here
        });

        socket.on("rejectRequest", (data) => {
            console.log(`Request rejected: ${data.requestId} by ${data.providerEmail}`);
            // Handle request rejection logic here
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

exports.getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
