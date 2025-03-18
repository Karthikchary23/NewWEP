"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

const CustomerDashboard = () => {
    const [name,setname]=useState("")
    const router = useRouter();

    useEffect(() => {
        Cookies.remove("spt");  
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
                    // console.log(response);
                    // console.log(response.data.email)
                    setname(response.data.name)
                    alert(`Welcome, ${response.data.name}`);
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
        <div className="flex flex-row justify-between items-center text-2xl text-white w-full px-4 mt-4">
    <div>
        Welcome to Customer Dashboard, {name}
    </div>

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
