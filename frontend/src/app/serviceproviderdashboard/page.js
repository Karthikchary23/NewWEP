"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { io } from "socket.io-client"; // Import socket.io client

const socket = io("http://localhost:4000", { transports: ["websocket"] });

const ServiceProviderDashboard = () => {
    const router = useRouter();
    const [email1, setEmail1] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const spt = Cookies.get("spt");
        if (!spt) {
            router.push("/");
            return;
        }

        // Verify token via API
        const verifyToken = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:4000/serviceprovidertoken/serviceprovidertokenverify",
                    { token: spt }
                );

                if (response.status === 200) {
                    setEmail1(response.data.serviceprovider.email);
                    setName(response.data.serviceprovider.firstName || "Provider");
                    alert(`Welcome, ${response.data.serviceprovider.firstName || "Provider"}`);

                    // Join the service provider to the socket room
                    socket.emit("joinServiceProvider", response.data.serviceprovider.email);
                }
            } catch (err) {
                console.error("Token verification error:", err);
                Cookies.remove("spt");
                router.push("/");
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    useEffect(() => {
        function getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log(latitude,longitude)
                        setLocation({ lat: latitude, lng: longitude });

                        // Send updated location to the backend
                        // updateLocation(latitude, longitude);
                        // alert(location)
                    },
                    (error) => {
                        alert("Error getting location");
                        console.error("Geolocation error:", error);
                    },
                    { enableHighAccuracy: true, maximumAge: 0 }
                );
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
            
        }
        

        async function updateLocation(latitude, longitude) {
            alert(latitude,longitude)
            if (!email1) return;
            try {
                await axios.post("http://localhost:4000/serviceproviderlocation/update-location", {
                    latitude,
                    longitude,
                    email: email1,
                });
                console.log("Location updated successfully!");
            } catch (error) {
                console.error("Error updating location:", error);
            }
        }

        getCurrentLocation();
    }, [email1]);

    useEffect(() => {
        socket.on("newServiceRequest", (requestData) => {
            console.log("New request received:", requestData);
            setRequests((prevRequests) => [...prevRequests, requestData]);
        });

        socket.on("connect", () => console.log("Socket connected"));
        socket.on("disconnect", () => console.log("Socket disconnected"));

        return () => {
            socket.off("newServiceRequest");
        };
    }, []);

    const handleAccept = (requestId) => {
        axios.post("http://localhost:4000/available/isavailable", { email: email1 })
            .then(response => {
                console.log(response.data.message);
                socket.emit("acceptRequest", { requestId, providerEmail: email1 });
            })
            .catch(err => {
                console.log(err);
            });
    };

    // 🔴 Handle Reject Request
    const handleReject = (requestId) => {
        socket.emit("rejectRequest", { requestId, providerEmail: email1 });
    };

    const handleLogout = () => {
        alert("You have been logged out!");
        Cookies.remove("spt", { path: "/" });
        setTimeout(() => router.push("/"), 500);
    };

    return (
        <div className="text-2xl text-white p-6">
            {loading ? (
                <p>Loading dashboard...</p>
            ) : (
                <>
                    <h1 className="text-3xl font-bold">Welcome, {name}</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-4 py-2 mt-4 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>

                    {/* Display Incoming Service Requests */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold">Incoming Requests</h2>
                        {requests.length > 0 ? (
                            requests.map((req, index) => (
                                <div key={index} className="border p-4 mt-2 bg-gray-800 rounded-md">
                                    <p><strong>Customer ID:</strong> {req.customerId}</p>
                                    <p><strong>Service Type:</strong> {req.serviceType}</p>
                                    <p><strong>Location:</strong> {req.customerLocation.join(", ")}</p>
                                    <div className="mt-2">
                                        <button
                                            onClick={() => handleAccept(req.customerId)}
                                            className="bg-green-500 px-3 py-1 rounded text-white mx-2"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(req._id)}
                                            className="bg-red-500 px-3 py-1 rounded text-white"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No new requests</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ServiceProviderDashboard;

