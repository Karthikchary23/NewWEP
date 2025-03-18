"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const ServiceProviderDashboard = () => {
    const router = useRouter();
    const [email1,setemail1]=useState("")
    const [name,setname]=useState("")
    const [location, setLocation] = useState({ lat: null, lng: null });

    useEffect(() => {
        const spt = Cookies.get("spt");
        console.log(spt);

        if (!spt) {
            router.push("/");
            return;
        }

        // Verify token via API
        const verifyToken = async () => {
            try {
                const response = await axios.post("http://localhost:4000/serviceprovidertoken/serviceprovidertokenverify", {
                    token: spt
                });

                if (response.status === 200) {
                    console.log(response);
                    setemail1(response.data.serviceprovider.email)
                    
                    setname(response.data.firstName)
                    alert(`Welcome ,${response.data.firstName}`);
                }
            } catch (err) {
                console.error("Token verification error:", err);

                // Remove the token and redirect for any error
                Cookies.remove("spt");
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
                axios.post("http://localhost:4000/serviceproviderlocation/update-location", {
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

    const handleLogout = () => {
        alert("You have been logged out!");
        console.log("Logging out...");

        Cookies.remove("spt", { path: "/" });

        setTimeout(() => {
            router.push("/");
        }, 500); // Delay to ensure cookies are cleared before redirection
    };

    return (
        <div className="text-2xl text-white">
            
            {`Welcome to Service Provider Dashboard, ${name}`}
            <br />
            <button 
                onClick={handleLogout} 
                className="bg-red-500 px-4 py-2 mt-4 rounded hover:bg-red-700 transition"
            >
                Logout
            </button>
        </div>
    );
};

export default ServiceProviderDashboard;
