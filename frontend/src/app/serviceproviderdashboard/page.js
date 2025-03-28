"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { io } from "socket.io-client"; // Import socket.io client
import Map from "../../Components/Maps";

const socket = io("http://localhost:4000", { transports: ["websocket"] });

const ServiceProviderDashboard = () => {
  const router = useRouter();
  const [email1, setEmail1] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [customerLocation, setcustomerLocation] = useState({
    lat: null,
    lng: null,
  });
  const [serviceType, setServiceType] = useState("");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const spt = Cookies.get("spt");
    if (!spt) {
      router.push("/");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:4000/serviceprovidertoken/serviceprovidertokenverify",
          { token: spt }
        );

        if (response.status === 200) {
          console.log("Current response", response.data);
          setEmail1(response.data.serviceprovider.email);
          setName(response.data.serviceprovider.firstName || "Provider");
          setServiceType(response.data.serviceprovider.serviceType);

          alert(
            `Welcome, ${response.data.serviceprovider.firstName || "Provider"}`
          );

          const providerData = {
            email: response.data.serviceprovider.email,
            serviceType: response.data.serviceprovider.serviceType, // This comes from your sign-in page
          };

          // Register provider with socket
          socket.emit("registerServiceProvider", providerData);
        }
      } catch (err) {
        console.error("Token verification error:", err);
        Cookies.remove("spt");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
    const check = localStorage.getItem("available") ;
    if(!check)
    {
      localStorage.setItem("available", "true");

    }


    const storedRequests = JSON.parse(localStorage.getItem("serviceAccepted")) || [];
    setRequests(storedRequests);
  }, []);

  useEffect(() => {
    function getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude, longitude);
            setLocation({ lat: latitude, lng: longitude });

            updateLocation(latitude, longitude);
            // alert(location)
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
          {
            latitude,
            longitude,
            email: email1,
          }
        );
        console.log("Location updated successfully!");
      } catch (error) {
        console.error("Error updating location:", error);
      }
    }

    getCurrentLocation();
  }, [email1]);

  useEffect(() => {
    socket.on("newServiceRequest", (data) => {
      const isAvailable = localStorage.getItem("available") === "true";

      if (isAvailable )
      {
        console.log("New service request received:", data);
      alert(`New request from ${data.customerName} for ${data.serviceType}`);
      setRequests((prevRequests) => [...prevRequests, { ...data, isAccepted: false }]);

      }
      
      

      
    });

    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));

    return () => {
      socket.off("newServiceRequest");
    };
  }, []);

  const handleAccept = (requestId, customerlocation, servicetype, cuname,fulladdress) => {
    // alert(customerlocation);
    if (!customerlocation) {
      console.error("customerlocation is undefined or empty");
      return alert("invalid location");
    }
    if (customerlocation) {
      const coordinates = customerlocation;
      if (
        coordinates.length === 2 &&
        coordinates.every((coord) => typeof coord === "number")
      ) {
        const culatitude = coordinates[0];
        const culongitude = coordinates[1];

        console.log("Latitude:", culatitude);
        console.log("Longitude:", culongitude);
        setcustomerLocation({ lat: culatitude, lng: culongitude });
        const updatedCustomerLocation = { lat: culatitude, lng: culongitude };
        const data = {
          customername: cuname,
          customermail: requestId,
          customerlocation: updatedCustomerLocation,
          servicetype,
          serviceprovidername: name,
          serviceprovideremail: email1,
          serviceproviderlocation: location,
        };

        console.log("Data Object:", data);
        axios
          .post("http://localhost:4000/available/isavailable", {
            email: email1,
          })
          .then((response) => {
            // alert(response.data.message);
            axios
              .post("http://localhost:4000/request/requestupdate", data)
              .then((response) => {
                console.log(response);

                socket.emit("serviceAccepted", {
                  customerEmail: requestId, // Customer's email
                  providerName: name,
                  providerEmail: email1,
                  providerLocation: location,
                  serviceType: servicetype,
                });

                alert("Customer has been notified!");
                localStorage.setItem("available", "false");

                let serviceDataArray =
                  JSON.parse(localStorage.getItem("serviceAccepted")) || [];

                // Create new data entry
                const newServiceData = {
                  customerName: cuname,
                  customerId:requestId,
                  serviceType: servicetype,
                  customerlocation: updatedCustomerLocation,
                  Fulladdress:fulladdress,
                  providerName: name,
                  providerEmail: email1,
                  providerLocation: location,
                  isAccepted:true,
                  isAvailable:false
                };

                // Add new entry to the array
                serviceDataArray.push(newServiceData);

                // Store updated array in Local Storage
                localStorage.setItem(
                  "serviceAccepted",
                  JSON.stringify(serviceDataArray)
                );
                setRequests((prevRequests) =>
                  prevRequests.map((req) =>
                    req.customerId === requestId ? { ...req, isAccepted: true } : req
                  )
                );
              })
              .catch((error) => {
                console.error("Error updating request:", error);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Invalid customerlocation format");
      }
    } else {
      console.error("customerlocation is not a valid string");
    }
  };

  const handleReject = (requestId,) => {
    // Emit cancelRequest event to the server
    

    alert("Request has been canceled!");
    localStorage.setItem("available", "true");
    axios.post("http://localhost:4000/request/deleterequest", {customermail:requestId,serviceprovideremail:email1})
              .then((response) => {
                if(response.status==200)
                {
                  socket.emit("cancelRequest", {
                    requestId,
                    providerEmail: email1,
                  });
              
                  // Remove the request from the local state
                  setRequests((prevRequests) =>
                    prevRequests.filter((req) => req.customerId !== requestId)
                  );
              
                  // Optionally, update localStorage
                  const updatedRequests = JSON.parse(localStorage.getItem("serviceAccepted")) || [];
                  const filteredRequests = updatedRequests.filter((req) => req.customerId !== requestId);
                  localStorage.setItem("serviceAccepted", JSON.stringify(filteredRequests));
                }

              }) .catch((error) => {
                console.error("Error Deleting request request:", error);
              });


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
          <div className="flex flex-row justify-between items-center text-2xl text-white w-full px-4">
            Welcome, {name}, {serviceType}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
          <Map />

          <div className="mt-14">
            <h2 className="text-xl font-bold">Incoming Requests</h2>
            {requests.length > 0 ? (
              requests.map((req, index) => (
                <div
                  key={index}
                  className="border p-4 mt-2 bg-gray-800 rounded-md"
                >
                  <p>
                    <strong>Customer name:</strong> {req.customerName}
                  </p>
                  <p>
                    <strong>Customer ID:</strong> {req.customerId}
                  </p>
                  <p>
                    <strong>Service Type:</strong> {req.serviceType}
                  </p>
                  <p>
                    <strong>Location:</strong> {req.Fulladdress}
                  </p>
                  
                  {!req.isAccepted ? (
  <div className="mt-2">
    <button
      onClick={() =>
        handleAccept(
          req.customerId,
          req.customerLocation,
          req.serviceType,
          req.customerName,
          req.Fulladdress
        )
      }
      className="bg-green-500 px-3 py-1 rounded text-white mx-2"
    >
      Accept
    </button>
    <button
      onClick={() => handleReject(req.customerId)}
      className="bg-red-500 px-3 py-1 rounded text-white"
    >
      Reject
    </button>
  </div>
) : (
  <div className="mt-2">
    <button
      onClick={() =>
        handleAccept(
          req.customerId,
          req.customerLocation,
          req.serviceType,
          req.customerName,
          req.Fulladdress
        )
      }
      className="bg-green-500 px-3 py-1 rounded text-white mx-2"
    >
      complete
    </button>
    <button
      onClick={() => handleReject(req.customerId,email1
        
      )}
      className="bg-red-500 px-3 py-1 rounded text-white"
    >
      Cancel
    </button>
  </div>
)}

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
