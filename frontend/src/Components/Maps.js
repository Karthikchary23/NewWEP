"use client"; // Ensure this runs on the client-side

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Dynamically import react-leaflet components to prevent SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const useMapEvents = dynamic(() => import("react-leaflet").then((mod) => mod.useMapEvents), { ssr: false });

const defaultCoords = [17.385044, 78.486671];

const UpdateMapView = ({ coords }) => {
    useMapEvents({
        move() {
            console.log("Map moved"); // Debugging
        },
    });

    return null;
};

const Map = () => {
    const [coord, setCoord] = useState(null);
    const [L, setL] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            import("leaflet").then((leaflet) => {
                setL(leaflet);
            });

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCoord([latitude, longitude]);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        setCoord(defaultCoords);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setCoord(defaultCoords);
            }
        }
    }, []);

    if (!coord || !L) return <div style={{ textAlign: "center", padding: "20px" }}>Loading map...</div>;

    const customIcon = new L.Icon({
        iconUrl: "https://imgs.search.brave.com/e-jYbbVF31tXIyuWEM_vlOFFSsNx9LbbxOOaAnvF67c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNC8w/NC8wMi8xMC80NS9s/b2NhdGlvbi0zMDQ0/NjdfXzM0MC5wbmc",
        iconRetinaUrl: "https://imgs.search.brave.com/e-jYbbVF31tXIyuWEM_vlOFFSsNx9LbbxOOaAnvF67c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNC8w/NC8wMi8xMC80NS9s/b2NhdGlvbi0zMDQ0/NjdfXzM0MC5wbmc",
        iconSize: [20, 30],
        iconAnchor: [10, 30],
        popupAnchor: [0, -30],
    });

    return (
        <div style={{ height: "40vh", width: "100vw", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 50 }}>
            <MapContainer
                style={{ height: "50vh", width: "95vw", borderRadius: "10px" }}
                center={coord}
                zoom={10}
                scrollWheelZoom={true}
            >
                <UpdateMapView coords={coord} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker icon={customIcon} position={coord}>
                    <Popup>Your current location.</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

// Disable SSR for the Map component
export default dynamic(() => Promise.resolve(Map), { ssr: false });
