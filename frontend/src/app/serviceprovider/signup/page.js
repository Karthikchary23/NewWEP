"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from 'axios'; // Ensure axios is imported
import Link from "next/link";

export default function ServiceProviderSignup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(null);
  const [verified, setVerified] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetOtp = async (data) => {
    try {
        setIsLoading(true);
        setSignupError(null);

        const response = await axios.post("http://localhost:4000/otp/send-otp", {
            email: data.email,
            mobile: data.mobile
        });

        if (response.status === 200) {
            setOtpSent(true);
            console.log(response.data.message);
            console.log(response.data.otp);
            setOtp(response.data.otp);
        } else {
            throw new Error(response.data.message);
            
        }
    } catch (error) {
        setSignupError("user already exists check mail and phone number");

    } finally {
        setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSignupError(null);
      console.log(otp)
      console.log(data.verificationotp)

      if (data.verificationotp !== otp) {
        throw new Error("Invalid OTP");
      }

      const signupData = {
        firstName: data.firstName,
        lastName: data.lastName || "",
        email: data.email,
        mobile: Number(data.mobile),
        address: data.address || "",
        localArea: data.localArea || "",
        serviceType: data.serviceType,
        password: data.password,
      };

      const response = await axios.post("http://localhost:4000/service-provider/service-providersignup", signupData);
      console.log(response.status)
      console.log(response.data.message)

      if (response.status === 200) {
        alert("Signup successful!");
        router.push("/serviceprovider/signin");      }

      
    } catch (error) {
      setSignupError("Enter valid otp");
      setIsLoading(false);
    } 
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-8 tracking-tight">
          Service Provider Signup
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">First Name</label>
            <input
              {...register("firstName", { required: "First name is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">Last Name</label>
            <input
              {...register("lastName")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">Mobile</label>
            <input
              type="tel"
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Mobile must be 10 digits",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 10-digit mobile"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs">{errors.mobile.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">Address</label>
            <input
              {...register("address")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">Local Area</label>
            <input
              {...register("localArea")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter local area (optional)"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">Service Type</label>
            <select
              {...register("serviceType", { required: "Service type is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select service type</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="cleaning">Cleaning</option>
              <option value="repair">Repair</option>
            </select>
            {errors.serviceType && (
              <p className="text-red-500 text-xs">{errors.serviceType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium text-sm">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSubmit(onGetOtp)}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium text-sm">OTP</label>
                <input
                  type="text"
                  {...register("verificationotp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{4,6}$/,
                      message: "OTP must be 4-6 digits",
                    },
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter OTP"
                />
                {errors.verificationotp && (
                  <p className="text-red-500 text-xs">{errors.verificationotp.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </>
          )}

          {signupError && (
            <p className="text-red-500 text-center text-sm">{signupError}</p>
          )}

          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <Link href="/serviceprovider/signin" className="text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}