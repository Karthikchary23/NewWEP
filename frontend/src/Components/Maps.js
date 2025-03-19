"use client"; // Required for Next.js 13+ (app directory)

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    alert("Unable to fetch location. Please allow location access.");
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    const center = location.latitude && location.longitude
        ? [location.latitude, location.longitude]
        : [17.3850, 78.4867]; // Default Hyderabad

    return (
        <MapContainer center={center} zoom={15} style={{ height: "400px", width: "100%" }}>
            {/* OpenStreetMap Tiles (Free) */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Marker for User Location */}
            {location.latitude && location.longitude && (
                <Marker position={[location.latitude, location.longitude]}>
                    <Popup>Your Current Location</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
