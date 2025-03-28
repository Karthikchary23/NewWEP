"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import Map from "@/Components/Maps";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { transports: ["websocket"] });

const CustomerDashboard = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [name, setName] = useState("");
  const [email1, setEmail1] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const router = useRouter();
  const [serviceProvider, setServiceProvider] = useState([]);
  const [requests,setRequests] = useState([]);
  
  useEffect(() => {
    // Remove "spt" token (if any)
    Cookies.remove("spt");
    const ct = Cookies.get("ct");

    if (!ct) {
      router.push("/");
      return;
    }
    // ✅ Verify Token & Fetch User Details
    const verifyToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/customertoken/customertokenverify",
          {
            token: ct,
          }
        );

        if (response.status === 200) {
          console.log("customer Respjnse", response.data);
          setName(response.data.name);
          setEmail1(response.data.email);
          setCustomerAddress(response.data.Fulladdress);

          alert(`Welcome, ${response.data.name}`);
          console.log("Socket Connected:", socket.connected);
          socket.emit("registerCustomer", response.data.email);

        }
      } catch (err) {
        console.error("Token verification error:", err);
        Cookies.remove("ct"); // Remove invalid token
        router.push("/");
      }
    };

    verifyToken();
  }, []); //this useEffect for customer verification

  useEffect(() => {
    const fetchingAcceptedRequests = async (providerEmail, customerEmail) => {
      const res = await axios.get("http://localhost:4000/request/acceptedrequests", {
        params: {
          providerEmail: providerEmail,
          customerEmail: customerEmail,
        },
      });

      if (res.status === 200) {
        return res.data; // Return the fetched data
      } else {
        throw new Error("Failed to fetch accepted requests");
      }
    };

    const handleNotification = async (data) => {
      console.log("Service provider assigned:", data);
      alert(`Service Accepted! Provider: ${data.providerName}`);

      try {
        const acceptedRequest = await fetchingAcceptedRequests(data.providerEmail, data.customerEmail);
        console.log("Fetched Request:", acceptedRequest);

        // Add missing fields (email, address, and currentLocation) to the acceptedRequest object
        const completeRequest = {
          ...acceptedRequest
        };

        // Prevent duplicate entries in `requests`
        setRequests((prevRequests) => {
          const isDuplicate = prevRequests.some((req) => req.Mobile === completeRequest.Mobile);
          if (!isDuplicate) {
            const updatedRequests = [...prevRequests, completeRequest];
            localStorage.setItem("serviceProviderDetails", JSON.stringify(updatedRequests)); // Update local storage
            return updatedRequests;
          }
          return prevRequests;
        });

        // Update `serviceProvider` state with the latest accepted request
        setServiceProvider(completeRequest);
      } catch (error) {
        console.error("Error handling notification:", error);
      }
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  useEffect(() => {
    console.log("Updated Requests State:", requests);
    console.log("Updated Service Provider State:", serviceProvider);
  }, [requests, serviceProvider]);

  useEffect(() => {
    function getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("User Location:", latitude, longitude);

            // Update state
            setLocation({ lat: latitude, lng: longitude });

            updateLocation(latitude, longitude, email1);
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

    async function updateLocation(latitude, longitude, email1) {
      if (!email1) return;

      try {
        await axios.post(
          "http://localhost:4000/customerlocation/update-location",
          {
            latitude,
            longitude,
            email: email1,
          }
        );
        // alert("location success")

        console.log("Location updated successfully!");
      } catch (error) {
        alert("not success");
        console.error("Error updating location:", error);
      }
    }

    getCurrentLocation();
    // alert("email not found",email1)
  }, [email1]);

  useEffect(() => {
    // Fetch service provider details from local storage on page load
    const storedServiceProvider = JSON.parse(localStorage.getItem("serviceProviderDetails"));
    if (storedServiceProvider && storedServiceProvider.length > 0) {
      setServiceProvider(storedServiceProvider[storedServiceProvider.length - 1]); // Set the latest service provider
    }
  }, []);

  useEffect(() => {
    // Fetch requests from local storage on page load
    const storedRequests = JSON.parse(localStorage.getItem("serviceProviderDetails")) || [];
    setRequests(storedRequests);
  }, []);

  const handleRequestService = async (serviceType) => {
    if (!location.lat || !location.lng) {
      alert("Location not available. Please allow location access.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/request/request-service",
        {
          name,
          email: email1,
          latitude: location.lat,
          longitude: location.lng,
          Fulladdress: customerAddress,
          serviceType,
        }
      );

      if (response.status === 200) {
        alert(`Request for ${serviceType} sent successfully!`);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send service request.");
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    alert("You have been logged out!");
    Cookies.remove("ct"); // Remove customer token
    setTimeout(() => {
      router.push("/");
    }, 500); // Ensure logout is processed before redirect
  };
  console.log("craztyy",requests)
  console.log("service provider ",serviceProvider)

  
  const handleCancel = (serviceProviderEmail) => {
    // Send a request to the backend to delete the request
    axios
      .post("http://localhost:4000/request/deleterequest", {
        customermail: email1,
        serviceprovideremail: serviceProviderEmail,
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Request has been canceled!");
  
          // Emit cancelRequest event to the server
          socket.emit("cancelRequest", {
            customerEmail: email1,
            providerEmail: serviceProviderEmail,
          });
  
          // Remove the request from the local state
          const updatedRequests = requests.filter(
            (provider) => provider.email !== serviceProviderEmail
          );
          setRequests(updatedRequests);
  
          // Update local storage
          localStorage.setItem("serviceProviderDetails", JSON.stringify(updatedRequests));
        }
      })
      .catch((error) => {
        console.error("Error deleting request:", error);
        alert("Failed to cancel the request. Please try again.");
      });
  };
  

  const handleVerify = (provider) => {
    alert(`Verified service provider: ${provider.Name}`);
    // Add your custom logic here (e.g., send verification to the server)
  };

  return (
    <>
      <div className="flex flex-col items-center w-full px-4 mt-4">
        <div className="flex flex-row justify-between items-center text-2xl text-white w-full px-4">
          <div>Welcome to Customer Dashboard, {name} </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
        <Map />

        {/* ✅ Service Options */}
        <div className="grid grid-cols-2 gap-6 mt-28 w-full max-w-lg">
          {/* Electrician */}
          <div
            onClick={() => handleRequestService("Electrician")}
            className="bg-blue-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-blue-700 transition"
          >
            ⚡ Electrician
          </div>

          {/* Plumber */}
          <div
            onClick={() => handleRequestService("Plumber")}
            className="bg-green-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-green-700 transition"
          >
            🔧 Plumber
          </div>

          {/* Cook */}
          <div
            onClick={() => handleRequestService("Cook")}
            className="bg-orange-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-orange-700 transition"
          >
            🍳 Cook
          </div>

          
          <div
            onClick={() => handleRequestService("Water Service")}
            className="bg-teal-500 text-white text-xl font-semibold p-6 rounded-lg text-center cursor-pointer hover:bg-teal-700 transition"
          >
            💧 Water Service
          </div>
        </div>
      </div>
      <div className="text-white p-6">
  <h1 className="text-2xl">Customer Dashboard</h1>

  {requests.length > 0 ? (
    requests.map((provider, index) => (
      <div key={index} className="mt-4 bg-gray-800 p-4 rounded">
        <h2 className="text-xl font-bold">Service Provider Details</h2>
        <p>
          <strong>Name:</strong> {provider.Name || "N/A"}
        </p>
        <p>
          <strong>Mobile:</strong> {provider.Mobile || "N/A"}
        </p>
        <p>
          <strong>Email:</strong> {provider.email || "N/A"}
        </p>
        <p>
          <strong>Location:</strong>{" "}
          {provider?.currentLocation?.coordinates &&
          provider.currentLocation.coordinates.length === 2
            ? `${provider.currentLocation.coordinates[0]}, ${provider.currentLocation.coordinates[1]}`
            : "Location not available"}
        </p>
        <p>
          <strong>Service Type:</strong> {provider.ServiceType || "N/A"}
        </p>

        {/* Buttons for Verify and Cancel */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleVerify(provider)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Verify
          </button>
          <button
            onClick={() => handleCancel(provider.email)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    ))
  ) : (
    <p>No service providers assigned yet.</p>
  )}
</div>
    </>
  );
};

export default CustomerDashboard;