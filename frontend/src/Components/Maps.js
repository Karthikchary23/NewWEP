import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';
import location from "../../public/location.png";

const defaultCoords = [17.385044, 78.486671];

const UpdateMapView = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, 13);
        }
    }, [coords, map]);
    return null;
};

const Map = () => {
    const [coord, setCoord] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCoord([latitude, longitude]);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setCoord(defaultCoords);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setCoord(defaultCoords);
        }
    }, []);

    const customIcon = new L.Icon({
        iconUrl: "https://imgs.search.brave.com/e-jYbbVF31tXIyuWEM_vlOFFSsNx9LbbxOOaAnvF67c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNC8w/NC8wMi8xMC80NS9s/b2NhdGlvbi0zMDQ0/NjdfXzM0MC5wbmc",
        iconRetinaUrl: "https://imgs.search.brave.com/e-jYbbVF31tXIyuWEM_vlOFFSsNx9LbbxOOaAnvF67c/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNC8w/NC8wMi8xMC80NS9s/b2NhdGlvbi0zMDQ0/NjdfXzM0MC5wbmc",
        iconSize: [20, 30], // Further reduced pin size for responsiveness
        iconAnchor: [10, 30],
        popupAnchor: [0, -30],
    });

    if (!coord) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading map...</div>;
    console.log(coord);
    return (
        <div style={{ height: '40vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:50}}>
            <MapContainer 
                style={{ height: '50vh', width: '95vw', borderRadius: '10px' }} 
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
                    <Popup>
                        Your current location.
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Map;