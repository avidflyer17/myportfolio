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
                // Primary service: Local API proxy (avoids CORS)
                const res = await fetch("/api/location");
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                const data = await res.json();
                if (data.latitude && data.longitude) {
                    setUserLocation({
                        lat: data.latitude,
                        lng: data.longitude,
                        city: data.city,
                        country: data.country_name,
                    });
                    return;
                }
            } catch (err) {
                console.warn("Primary IP fetch failed, trying fallback...", err);
            }

            try {
                // Fallback service: ipwho.is
                const res = await fetch("https://ipwho.is/");
                if (!res.ok) throw new Error(`ipwho.is error: ${res.status}`);
                const data = await res.json();
                if (data.success && data.latitude && data.longitude) {
                    setUserLocation({
                        lat: data.latitude,
                        lng: data.longitude,
                        city: data.city,
                        country: data.country,
                    });
                } else {
                    console.warn("Fallback IP service failed or returned invalid data", data);
                }
            } catch (err) {
                console.warn("All IP fetch attempts failed. Defaulting to headquarters.", err);
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
