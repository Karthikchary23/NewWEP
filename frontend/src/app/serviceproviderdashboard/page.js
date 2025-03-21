"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", { transports: ["websocket"] });

const ServiceProviderDashboard = () => {
  const router = useRouter();
  const [email1, setEmail1] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [customerLocation, setCustomerLocation] = useState({ lat: null, lng: null });
  const [requests, setRequests] = useState([]);
  const [acceptedRequest, setAcceptedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const spt = Cookies.get("spt");
    if (!spt) {
      router.push("/");
      return;
    }

    const verifyTokenAndFetchAccepted = async () => {
      try {
        // Verify token
        const tokenResponse = await axios.post(
          "http://localhost:4000/serviceprovidertoken/serviceprovidertokenverify",
          { token: spt }
        );

        if (tokenResponse.status === 200) {
          const providerEmail = tokenResponse.data.serviceprovider.email;
          setEmail1(providerEmail);
          setName(tokenResponse.data.serviceprovider.firstName || "Provider");
          alert(`Welcome, ${tokenResponse.data.serviceprovider.firstName || "Provider"}`);
          socket.emit("joinServiceProvider", providerEmail);

          // Fetch existing accepted request from database
          const acceptedResponse = await axios.get(
            "http://localhost:4000/request/get-accepted-request",
            { params: { serviceprovideremail: providerEmail } }
          );

          if (acceptedResponse.data.existingRequest) {
            alert("rev fo")
            setAcceptedRequest(acceptedResponse.data.existingRequest);
          }
        }
      } catch (err) {
        console.error("Error during initialization:", err);
        Cookies.remove("spt");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndFetchAccepted();
  }, []);

  useEffect(() => {
    function getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
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
      if (!email1) return;
      try {
        await axios.post(
          "http://localhost:4000/serviceproviderlocation/update-location",
          { latitude, longitude, email: email1 }
        );
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }

    getCurrentLocation();
  }, [email1]);

  useEffect(() => {
    socket.on("newServiceRequest", (requestData) => {
      setRequests((prevRequests) => [...prevRequests, requestData]);
    });

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket.off("newServiceRequest");
    };
  }, []);

  const handleAccept = (requestId, customerlocation, servicetype, cuname) => {
    if (!customerlocation) {
      console.error("customerlocation is undefined or empty");
      return;
    }

    if (typeof customerlocation === "string") {
      const coordinates = customerlocation.split(", ").map(Number);
      if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
        const culatitude = coordinates[0];
        const culongitude = coordinates[1];
        setCustomerLocation({ lat: culatitude, lng: culongitude });

        const data = {
          customername: cuname,
          customermail: requestId,
          customerlocation: { lat: culatitude, lng: culongitude },
          servicetype,
          serviceprovidername: name,
          serviceprovideremail: email1,
          serviceproviderlocation: location,
        };

        axios
          .post("http://localhost:4000/available/isavailable", { email: email1 })
          .then((response) => {
            alert(response.data.message);
            axios
              .post("http://localhost:4000/request/requestupdate", data)
              .then((response) => {
                console.log("Response data:", response.data.existingRequest);
                setAcceptedRequest(response.data.existingRequest);
                setRequests((prev) => prev.filter((req) => req.customerId !== requestId));
                socket.emit("acceptRequest", { 
                  requestId: data.customermail, 
                  providerEmail: data.serviceprovideremail 
                });
              })
              .catch((error) => {
                console.error("Error updating request:", error);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.error("Invalid customerlocation format");
      }
    } else {
      console.error("customerlocation is not a valid string");
    }
  };

  const handleReject = (requestId) => {
    socket.emit("rejectRequest", { requestId, providerEmail: email1 });
    setRequests((prev) => prev.filter((req) => req.customerId !== requestId));
  };

  const handleCancel = () => {
    socket.emit("cancelRequest", { 
      requestId: acceptedRequest.customermail, 
      providerEmail: email1 
    });
    setAcceptedRequest(null);
  };

  const handleComplete = () => {
    socket.emit("completeRequest", { 
      requestId: acceptedRequest.customermail, 
      providerEmail: email1 
    });
    setAcceptedRequest(null);
  };

  const handleLogout = () => {
    alert("You have been logged out!");
    Cookies.remove("spt", { path: "/" });
    setTimeout(() => router.push("/"), 500);
  };

  return (
    <div className="text-2xl text-white p-6">
      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold">Welcome, {name}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 mt-4 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>

          {acceptedRequest && (
            <div className="mt-6 border p-4 bg-gray-800 rounded-md">
              <h2 className="text-xl font-bold">Accepted Request</h2>
              <p><strong>Customer Name:</strong> {acceptedRequest.customername || 'N/A'}</p>
              <p><strong>Customer Email:</strong> {acceptedRequest.customermail || 'N/A'}</p>
              <p><strong>Service Type:</strong> {acceptedRequest.servicetype || 'N/A'}</p>
              <p>
                <strong>Customer Location:</strong>{" "}
                {acceptedRequest.customerlocation && acceptedRequest.customerlocation.lat !== undefined 
                  ? `${acceptedRequest.customerlocation.lat}, ${acceptedRequest.customerlocation.lng}`
                  : 'Location unavailable'}
              </p>
              <p>
                <strong>Provider Location:</strong>{" "}
                {acceptedRequest.serviceproviderlocation && acceptedRequest.serviceproviderlocation.lat !== undefined
                  ? `${acceptedRequest.serviceproviderlocation.lat}, ${acceptedRequest.serviceproviderlocation.lng}`
                  : 'Location unavailable'}
              </p>
              <div className="mt-2">
                <button
                  onClick={handleCancel}
                  className="bg-yellow-500 px-3 py-1 rounded text-white mx-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleComplete}
                  className="bg-blue-500 px-3 py-1 rounded text-white"
                >
                  Complete
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-bold">Incoming Requests</h2>
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <div
                  key={index}
                  className="border p-4 mt-2 bg-gray-800 rounded-md"
                >
                  <p><strong>Customer name:</strong> {req.customername}</p>
                  <p><strong>Customer ID:</strong> {req.customerId}</p>
                  <p><strong>Service Type:</strong> {req.serviceType}</p>
                  <p><strong>Location:</strong> {req.customerLocation.join(", ")}</p>
                  <div className="mt-2">
                    <button
                      onClick={() =>
                        handleAccept(
                          req.customerId,
                          req.customerLocation.join(", "),
                          req.serviceType,
                          req.customername
                        )
                      }
                      className="bg-green-500 px-3 py-1 rounded text-white mx-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-500 px-3 py-1 rounded text-white"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No new requests</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceProviderDashboard;