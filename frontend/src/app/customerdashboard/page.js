"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

const CustomerDashboard = () => {
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [name, setName] = useState("");
    const [email1, setEmail1] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Remove "spt" token
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

                        // Send location to the backend
                        updateLocation(latitude, longitude);
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
            if (!email1) return; // Ensure email is available before sending

            try {
                axios.post("http://localhost:4000/customerlocation/update-location", {
                    latitude, longitude, email: email1 }).then(response=>
                    {
                        console.log(response.data)
                        console.log("Location updated successfully!");


                    }).catch(error => {
                        console.error('There was an error logging in', error);
                        alert('Invalid email or password');
                      });
               
            } catch (error) {
                console.error("Error updating location:", error);
            }
        }

        getCurrentLocation();
    }, [email1]); 

    // ✅ Logout function
    const handleLogout = () => {
        alert("You have been logged out!");

        Cookies.remove("ct"); // Remove customer token

        setTimeout(() => {
            router.push("/");
        }, 500); // Ensure logout is processed before redirect
    };

    return (
        <div className="flex flex-row justify-between items-center text-2xl text-white w-full px-4 mt-4">
            <div>Welcome to Customer Dashboard, {name}</div>

            <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
            >
                Logout
            </button>
        </div>
    );
};

export default CustomerDashboard;
