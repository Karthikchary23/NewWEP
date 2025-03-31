"use client";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

export default function SignIn() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetOtp = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("https://wepbackend23.onrender.com/customersigninotp/customerdashboardsigninotpsend-otp", {
        email: data.email,
      });

      if (response.status !== 200) {
        throw new Error("Failed to send OTP. Check your credentials.");
      }

      setOtpSent(response.data.otp);
      alert("OTP sent to your email!");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      if(data.otp !== otpSent) {
        throw new Error("Invalid OTP. Please try again.");

    }

      setOtpVerified(true);
      alert("OTP verified successfully!");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
    
  };

  const onSubmit = async (data) => {
    if (!otpVerified) {
      setError("Please verify OTP before signing in.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Final sign-in API call
      const response = await axios.post("https://wepbackend23.onrender.com/customer/signin", {
        email: data.email,
        password: data.password,
       
          
        });
     

      if (response.status !== 200) {
        throw new Error("Sign in failed");
      }
      console.log(response.data.token);
      const spt=Cookies.get('spt')
            if (spt)
            {
              Cookies.remove('spt')
      
            }
      Cookies.set("ct", response.data.token, { expires: 7 }); 


      alert("Signed in successfully!");
      router.push("/customerdashboard");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email"
                }
              })}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpVerified}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              {...register("password", { 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={otpVerified}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {!otpSent && (
            <button
              type="button"
              onClick={handleSubmit(onGetOtp)}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition disabled:bg-green-300"
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          )}

          {otpSent && !otpVerified && (
            <div>
              <label className="block text-gray-700 font-medium">Enter OTP</label>
              <input
                type="text"
                {...register("otp", { 
                  required: "OTP is required",
                  pattern: {
                    value: /^[0-9]{4,6}$/,
                    message: "OTP must be 4-6 digits"
                  }
                })}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.otp && <p className="text-red-500 text-sm">{errors.otp.message}</p>}
              <button
                type="button"
                onClick={handleSubmit(onVerifyOtp)}
                disabled={isLoading}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 mt-2 rounded-lg transition disabled:bg-purple-300"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={!otpVerified || isLoading}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              otpVerified 
                ? "bg-blue-500 hover:bg-blue-600 text-white" 
                : "bg-gray-400 cursor-not-allowed"
            } ${isLoading ? "opacity-50" : ""}`}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <p className="text-center text-gray-600 text-sm mt-4">
            Don't have an account?{" "}
            <Link href="/customer/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}