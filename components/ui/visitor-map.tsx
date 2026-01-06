"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ImageOverlay, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons in Next.js
// @ts-expect-error - Leaflet icon options are partial
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
}

// Custom hook to update map center
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

// Simulated network nodes for visual interest
const NETWORK_NODES: Location[] = [
    { lat: 48.8566, lng: 2.3522, city: "Paris", country: "FR" }, // Paris
    { lat: 40.7128, lng: -74.0060, city: "New York", country: "US" }, // NY
    { lat: 35.6762, lng: 139.6503, city: "Tokyo", country: "JP" }, // Tokyo
    { lat: 51.5074, lng: -0.1278, city: "London", country: "UK" }, // London
    { lat: 1.3521, lng: 103.8198, city: "Singapore", country: "SG" }, // Singapore
    { lat: 52.5200, lng: 13.4050, city: "Berlin", country: "DE" }, // Berlin
];

export function VisitorMap() {
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [geoData, setGeoData] = useState<any>(null);

    useEffect(() => {
        // Fetch GeoJSON for the map
        fetch('/world-geo.json')
            .then(res => res.json())
            .then(data => setGeoData(data))
            .catch(err => console.error("Failed to load map data", err));
        const fetchLocation = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                if (data.latitude && data.longitude) {
                    setUserLocation({
                        lat: data.latitude,
                        lng: data.longitude,
                        city: data.city,
                        country: data.country_name,
                    });
                }
            } catch (err) {
                console.warn("Could not fetch visitor location (likely blocked or offline):", err);
                // Fallback is already handled by default center
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    // Default center (Europe) if loading or failed
    const center: [number, number] = userLocation
        ? [userLocation.lat, userLocation.lng]
        : [48.8566, 2.3522];

    const zoom = userLocation ? 4 : 2;

    // Custom Cyberpunk Marker Icon
    const createCustomIcon = (color: string) => {
        return new L.DivIcon({
            className: "custom-icon",
            html: `<div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        border: 2px solid white;
        animation: pulse 2s infinite;
      "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });
    };

    const userIcon = createCustomIcon("#FF00FF"); // Neon Pink for user
    const nodeIcon = createCustomIcon("#00FFFF"); // Cyan for network nodes

    return (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,255,255,0.2)] bg-black/90 group">

            {/* Cyberpunk Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-[1000] bg-[url('/grid-pattern.svg')] opacity-20 bg-[size:20px_20px]"></div>
            <div className="absolute inset-0 pointer-events-none z-[1000] bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent animate-scanline"></div>

            {/* Map Header */}
            <div className="absolute top-0 left-0 right-0 z-[1000] bg-black/80 backdrop-blur-sm border-b border-neon-cyan/20 p-2 flex justify-between items-center px-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-neon-cyan tracking-wider">LIVE TRAFFIC MONITOR</span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                    <div className="text-[10px] text-gray-500 font-mono">
                        {loading ? "INITIALIZING LINK..." :
                            userLocation ? `${userLocation.city?.toUpperCase() || 'UNKNOWN'}, ${userLocation.country?.toUpperCase() || 'TERRA'}` :
                                "SIGNAL LOST - DEFAULTING TO HQ"}
                    </div>
                </div>
            </div>

            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                className="w-full h-full z-0"
                style={{ background: "#050505" }}
            >
                <ChangeView center={center} zoom={zoom} />

                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={{
                            fillColor: "#050505", // Almost black fill
                            weight: 1,
                            color: "#333333", // Dark gray borders
                            fillOpacity: 0.9,
                        }}
                    />
                )}

                {/* User Location */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                        <Popup className="custom-popup">
                            <div className="font-mono text-xs">
                                <strong className="text-neon-pink block mb-1">YOU ARE HERE</strong>
                                <span className="text-gray-300">Target identified.</span>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Simulated Network Nodes */}
                {NETWORK_NODES.map((node, idx) => (
                    <Marker key={idx} position={[node.lat, node.lng]} icon={nodeIcon}>
                        <Popup className="custom-popup">
                            <div className="font-mono text-xs">
                                <strong className="text-neon-cyan block mb-1">NODE {idx + 1}</strong>
                                <span className="text-gray-300">{node.city} Uplink Active</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-cyan z-[1000]"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan z-[1000]"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan z-[1000]"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-cyan z-[1000]"></div>

            <style jsx global>{`
        /* Make the map container slightly transparent to show grid pattern */
        .leaflet-container {
            background: transparent !important;
        }
        /* Style the GeoJSON paths (if needed extra CSS) */
        path.leaflet-interactive {
            stroke-dasharray: 2, 2; /* Cyberpunk dotted lines */
            filter: drop-shadow(0 0 2px rgba(0, 255, 255, 0.3));
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
            background: rgba(0, 0, 0, 0.9);
            color: white;
            border: 1px solid #00FFFF;
            border-radius: 4px;
        }
        .custom-popup .leaflet-popup-tip {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00FFFF;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 0, 255, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 0, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 0, 255, 0); }
        }
        @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }
        .animate-scanline {
            animation: scanline 4s linear infinite;
        }
      `}</style>
        </div>
    );
}
