"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

const CustomerDashboard = () => {
    const router = useRouter();

    useEffect(() => {
        Cookies.remove('spt')
        const ct = Cookies.get("ct");

        if (!ct) {
            router.push("/");
            return;
        }

        // Verify token via API
        axios.post("http://localhost:4000/customertoken/customertokenverify", {
            token: ct,
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
