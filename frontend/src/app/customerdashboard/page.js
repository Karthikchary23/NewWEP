"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import Map from "@/Components/Maps";

const CustomerDashboard = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [name, setName] = useState("");
    const [email1, setEmail1] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Remove "spt" token (if any)
        Cookies.remove("spt");
        const ct = Cookies.get("ct");

        // If customer token is missing, redirect to login
        if (!ct) {
            router.push("/");
            return;
        }

        // ✅ Verify Token & Fetch User Details
        const verifyToken = async () => {
            try {
                const response = await axios.post("http://localhost:4000/customertoken/customertokenverify", {
                    token: ct,
                });

                if (response.status === 200) {
                    setName(response.data.name);
                    setEmail1(response.data.email);
                    alert(`Welcome, ${response.data.name}`);
                    // alert(response.data.email)
                }
            } catch (err) {
                console.error("Token verification error:", err);
                Cookies.remove("ct"); // Remove invalid token
                router.push("/");
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
                        console.log("User Location:", latitude, longitude);

                        // Update state
                        setLocation({ lat: latitude, lng: longitude });

                        updateLocation(latitude, longitude,email1);
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

        async function updateLocation(latitude, longitude,email1) {
            if (!email1) return  ; 
            

            try {
                await axios.post("http://localhost:4000/customerlocation/update-location", {
                    latitude, longitude, email: email1
                });
                // alert("location success")

                console.log("Location updated successfully!");
            } catch (error) {
                alert("not success")
                console.error("Error updating location:", error);
            }
        }

        getCurrentLocation();
        // alert("email not found",email1)
    }, [email1]);

    // ✅ Send Service Request
    const handleRequestService = async (serviceType) => {
        if (!location.lat || !location.lng) {
            alert("Location not available. Please allow location access.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/request/request-service", {
                name,
                email: email1,
                latitude: location.lat,
                longitude: location.lng,
                serviceType, 
            });

            if (response.status === 200) {
                alert(`Request for ${serviceType} sent successfully!`);
            }
        } catch (error) {
            console.error("Error sending request:", error);
            alert("Failed to send service request.");
        }
    };

    // ✅ Logout function
    const handleLogout = () => {
        alert("You have been logged out!");
        Cookies.remove("ct"); // Remove customer token
        setTimeout(() => {
            router.push("/");
        }, 500); // Ensure logout is processed before redirect
    };

    return (
        <div className="flex flex-col items-center w-full px-4 mt-4">
            {/* ✅ Navbar (Same as Before) */}
            <div className="flex flex-row justify-between items-center text-2xl text-white w-full px-4">
                <div>Welcome to Customer Dashboard, {name}</div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
                >
                    Logout
                </button>
            </div>
            <Map/>

            {/* ✅ Service Options */}
            <div className="grid grid-cols-2 gap-6 mt-8 w-full max-w-lg">
                {/* Electrician */}
                <div 
                    onClick={() => handleRequestService("Electrician")} 
                    className="bg-blue-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-blue-700 transition"
                >
                    ⚡ Electrician
                </div>

                {/* Plumber */}
                <div 
                    onClick={() => handleRequestService("Plumber")} 
                    className="bg-green-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-green-700 transition"
                >
                    🔧 Plumber
                </div>

                {/* Cook */}
                <div 
                    onClick={() => handleRequestService("Cook")} 
                    className="bg-orange-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-orange-700 transition"
                >
                    🍳 Cook
                </div>

                {/* Water Service */}
                <div 
                    onClick={() => handleRequestService("Water Service")} 
                    className="bg-teal-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-teal-700 transition"
                >
                    💧 Water Service
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
