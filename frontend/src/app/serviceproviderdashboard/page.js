"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

const ServiceProviderDashboard = () => {
    const router = useRouter();

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
                    console.log(response.status);
                    alert("hello");
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
