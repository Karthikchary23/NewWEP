"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

const ServiceProviderDashboard = () => {
    const router = useRouter();

    useEffect(() => {
        
        const spt = Cookies.get("spt");

        if (!spt) {
            router.push("/");
            return;
        }

        // Verify token via API
        axios.get("http://localhost:4000/serviceprovidertoken/serviceprovidertokenverify", {
            headers: {
                Authorization: `Bearer ${spt}`,
            },
        })
        .then(response => {
            if (response.status !== 200) {
                console.log(response.status);
                router.push("/");
            }
        })
        .catch(() => {
            router.push("/");
        });
    }, []);

    // ✅ Logout function to remove spt token
    const handleLogout = () => {
        alert("You have been logged out!"); // Debugging
        console.log("Logging out...");

        Cookies.remove("spt", { path: "/" });

        setTimeout(() => {
            router.push("/");
        }, 500); // Delay to ensure cookies are cleared before redirection
    };

    return (
        <div className="text-2xl text-white">
            Welcome to Service Provider Dashboard
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
