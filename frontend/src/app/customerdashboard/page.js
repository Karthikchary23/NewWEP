"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

const CustomerDashboard = () => {
    const router = useRouter();

    useEffect(() => {
        Cookies.remove("spt");  // Ensure 'spt' is necessary
        const ct = Cookies.get("ct");
    
        if (!ct) {
            router.push("/");
            return;
        }
    
        const verifyToken = async () => {
            try {
                const response = await axios.post("http://localhost:4000/customertoken/customertokenverify", {
                    token: ct,
                });
    
                if (response.status === 200) {
                    console.log(response.status);
                    alert("hello");
                }
            } catch (err) {
                console.error("Token verification error:", err);
                
                // Remove the token and redirect for any error
                Cookies.remove("ct");  // Corrected cookie removal
                router.push("/");
            }
        };
    
        verifyToken();
    }, []);

    // ✅ Logout function to remove ct token
    const handleLogout = () => {
        alert("You have been logged out!"); // Debugging
        console.log("Logging out...");

        Cookies.remove("ct", { path: "/" });

        setTimeout(() => {
            router.push("/");
        }, 500); // Delay to ensure cookies are cleared before redirection
    };

    return (
        <div className="text-2xl text-white">
            Welcome to Customer Dashboard
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

export default CustomerDashboard;
