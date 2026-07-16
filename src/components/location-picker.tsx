"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";
import { useLocale } from "@/lib/i18n/locale-context";

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="background:#c8562d;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number]>([lat, lng]);
  const { t } = useLocale();

  function handlePick(newLat: number, newLng: number) {
    setPosition([newLat, newLng]);
    onChange(newLat, newLng);
  }

  function locateMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      handlePick(pos.coords.latitude, pos.coords.longitude);
    });
  }

  return (
    <div className="relative">
      <div
        className="h-72 w-full overflow-hidden rounded-2xl border border-stone-200"
        role="application"
        aria-label={t("checkout.mapHelp")}
      >
        <MapContainer center={position} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={markerIcon} />
          <ClickHandler onPick={handlePick} />
        </MapContainer>
      </div>
      <button
        type="button"
        onClick={locateMe}
        className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-[400] flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-brand-dark shadow-lg hover:bg-brand hover:text-white transition-colors"
      >
        <MapPin size={14} aria-hidden="true" /> {t("checkout.locateMe")}
      </button>
      <p className="mt-2 text-xs text-stone-400">
        {t("checkout.mapHelp")} ({position[0].toFixed(4)}, {position[1].toFixed(4)})
      </p>
    </div>
  );
}
