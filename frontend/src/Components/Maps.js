"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const defaultCenter = [17.385044, 78.486671];

const Routing = ({ L, customerLocation, providerLocation, setDistance }) => {
    const map = useMap();
    console.log("Routing component mounted", { customerLocation, providerLocation });

    useEffect(() => {
        if (map && L && L.Routing && customerLocation && providerLocation && customerLocation.lat && customerLocation.lng && providerLocation.lat && providerLocation.lng) {
            const routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(customerLocation.lat, customerLocation.lng),
                    L.latLng(providerLocation.lat, providerLocation.lng),
                ],
                routeWhileDragging: true,
                show: true,
                lineOptions: {
                    styles: [{ color: "blue", weight: 4 }],
                },
                createMarker: () => null, // Prevent default markers
            }).addTo(map);

            routingControl.on("routesfound", (e) => {
                const routes = e.routes;
                const summary = routes[0].summary;
                setDistance(summary.totalDistance / 1000); // Convert to km
            });

            return () => {
                map.removeControl(routingControl);
            };
        }
    }, [map, L, customerLocation, providerLocation, setDistance]);

    return null;
};

const Map = ({ providerLocation, customerLocation }) => {
    const [L, setL] = useState(null);
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((leaflet) => {
                import("leaflet-routing-machine").then(() => {
                    setL(leaflet.default); // Use leaflet.default for ES module
                });
            });
        }
    }, []);

    if (!L) return <div style={{ textAlign: "center", padding: "20px" }}>Loading map...</div>;

    const center = providerLocation && customerLocation && providerLocation.lat && providerLocation.lng && customerLocation.lat && customerLocation.lng
        ? [(providerLocation.lat + customerLocation.lat) / 2, (providerLocation.lng + customerLocation.lng) / 2]
        : defaultCenter;

    const providerIcon = new L.Icon({
        iconUrl: "/service.png", // Corrected path
        iconRetinaUrl: "/service.png",
        iconSize: [20, 30],
        iconAnchor: [10, 30],
        popupAnchor: [0, -30],
    });

    const customerIcon = new L.Icon({
        iconUrl: "/maps.png", // Corrected path
        iconRetinaUrl: "/maps.png",
        iconSize: [20, 30],
        iconAnchor: [10, 30],
        popupAnchor: [0, -30],
    });

    return (
        <div style={{ height: "40vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 50 }}>
            <MapContainer
                style={{ height: "50vh", width: "95vw", borderRadius: "10px" }}
                center={center}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {providerLocation && providerLocation.lat && providerLocation.lng && (
                    <Marker icon={providerIcon} position={[providerLocation.lat, providerLocation.lng]}>
                        <Popup>Service Provider Location</Popup>
                    </Marker>
                )}
                {customerLocation && customerLocation.lat && customerLocation.lng && (
                    <Marker icon={customerIcon} position={[customerLocation.lat, customerLocation.lng]}>
                        <Popup>Customer Location</Popup>
                    </Marker>
                )}
                {providerLocation && customerLocation && providerLocation.lat && providerLocation.lng && customerLocation.lat && customerLocation.lng && (
                    <Routing
                        L={L}
                        customerLocation={customerLocation}
                        providerLocation={providerLocation}
                        setDistance={setDistance}
                    />
                )}
            </MapContainer>
            {distance && (
                <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "white", padding: "5px", borderRadius: "5px" }}>
                    Distance: {distance.toFixed(2)} km
                </div>
            )}
        </div>
    );
};

export default dynamic(() => Promise.resolve(Map), { ssr: false });