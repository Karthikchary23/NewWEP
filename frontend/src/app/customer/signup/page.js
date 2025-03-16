"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CustomerSignup() {
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
  const [otp, setOtp] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetOtp = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:4000/otp/send-otp", {
        email: data.email,
        mobile: data.mobile,
      });

      if (response.status === 200) {
        setOtpSent(true);
        console.log(response.data.message);
        console.log(response.data.otp);
        setOtp(response.data.otp);
        alert("OTP sent successfully");
      } else {
        alert(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      if (data.customerVerificationOTP === otp) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!otpVerified) {
      setError("Please verify OTP before signing up.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const signupData = {
        name: data.name,
        email: data.email,
        phone: Number(data.phone),
        Fulladdress: data.Fulladdress,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        password: data.password,
        isCustomer: true,
        isServiceProvider: false,
      };

      const response = await axios.post(
        "http://localhost:4000/customer/customersignup",
        signupData
      );

      if (response.status !== 200) {
        throw new Error("Signup failed");
      }

      alert("Signup successful!");
      router.push("/customer/signin");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8 border border-gray-100/20">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Customer Signup
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your name"
              disabled={otpVerified}
            />
            {errors.name && <p className="text-rose-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email",
                },
              })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
              disabled={otpVerified}
            />
            {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone must be 10 digits",
                },
              })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your phone number"
              disabled={otpVerified}
            />
            {errors.phone && <p className="text-rose-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Address</label>
            <input
              type="text"
              {...register("Fulladdress", { required: "Address is required" })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your full address"
              disabled={otpVerified}
            />
            {errors.Fulladdress && <p className="text-rose-500 text-xs">{errors.Fulladdress.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your city"
              disabled={otpVerified}
            />
            {errors.city && <p className="text-rose-500 text-xs">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              {...register("postalCode", {
                required: "Postal code is required",
                pattern: {
                  value: /^[0-9]{5,6}$/,
                  message: "Invalid postal code",
                },
              })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your postal code"
              disabled={otpVerified}
            />
            {errors.postalCode && <p className="text-rose-500 text-xs">{errors.postalCode.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              {...register("country", { required: "Country is required" })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your country"
              disabled={otpVerified}
            />
            {errors.country && <p className="text-rose-500 text-xs">{errors.country.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Create a password"
              disabled={otpVerified}
            />
            {errors.password && <p className="text-rose-500 text-xs">{errors.password.message}</p>}
          </div>

          {!otpSent && (
            <button
              type="button"
              onClick={handleSubmit(onGetOtp)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Get OTP"}
            </button>
          )}

          {otpSent && !otpVerified && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                type="text"
                {...register("customerVerificationOTP", {
                  required: "OTP is required",
                  pattern: {
                    value: /^[0-9]{4,6}$/,
                    message: "OTP must be 4-6 digits",
                  },
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter OTP"
              />
              {errors.customerVerificationOTP && (
                <p className="text-rose-500 text-xs">{errors.customerVerificationOTP.message}</p>
              )}
              <button
                type="button"
                onClick={handleSubmit(onVerifyOtp)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {otpVerified && (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          )}

          {error && (
            <p className="text-rose-500 text-sm text-center bg-rose-50 p-2 rounded-lg">{error}</p>
          )}

          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-indigo-600 hover:text-indigo-800 transition-colors">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
