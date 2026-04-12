import { useEffect, useState } from "react";
import type { MapMouseEvent } from "maplibre-gl";
import { Loader2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  useMap,
  type MapViewport,
} from "@/components/ui/map";

type LocationMapPickerProps = {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
};

const DEFAULT_CENTER: [number, number] = [2.6326, 28.0339];
const DEFAULT_LATITUDE = 28.0339;
const DEFAULT_LONGITUDE = 2.6326;

function MapClickHandler({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const handleClick = (event: MapMouseEvent) => {
      onPick(event.lngLat.lat, event.lngLat.lng);
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, isLoaded, onPick]);

  return null;
}

export function LocationMapPicker({
  latitude,
  longitude,
  onChange,
}: LocationMapPickerProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [viewport, setViewport] = useState<Partial<MapViewport>>({
    center: DEFAULT_CENTER,
    zoom: 5.3,
  });

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }

    setViewport((current) => ({
      ...current,
      center: [longitude, latitude],
      zoom: current.zoom != null && current.zoom > 10 ? current.zoom : 12,
    }));
  }, [latitude, longitude]);

  const markerLatitude = latitude ?? DEFAULT_LATITUDE;
  const markerLongitude = longitude ?? DEFAULT_LONGITUDE;

  const handleLocateFromDevice = () => {
    if (!("geolocation" in navigator)) {
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(position.coords.latitude, position.coords.longitude);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
    );
  };

  return (
    <div>
      <div className="relative h-80 overflow-hidden rounded-xl border border-border">
        <Map
          viewport={viewport}
          onViewportChange={setViewport}
          className="absolute inset-0"
        >
          <MapControls />
          <MapClickHandler onPick={onChange} />
          <MapMarker
            longitude={markerLongitude}
            latitude={markerLatitude}
            draggable
            onDragEnd={(lngLat) => onChange(lngLat.lat, lngLat.lng)}
          >
            <MarkerContent />
          </MapMarker>
        </Map>
        <Button
          type="button"
          size="icon"
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full shadow-card"
          onClick={handleLocateFromDevice}
          disabled={isLocating}
          aria-label="Use current device location"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <LocateFixed className="h-4 w-4" aria-hidden />
          )}
        </Button>
      </div>

      <div className="mt-3 flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Latitude</label>
          <Input
            type="number"
            step="0.000001"
            placeholder="35.1897"
            value={latitude ?? ""}
            onChange={(event) => {
              const parsed = Number.parseFloat(event.target.value);
              if (!Number.isNaN(parsed)) {
                onChange(parsed, longitude ?? DEFAULT_LONGITUDE);
              }
            }}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-muted-foreground">Longitude</label>
          <Input
            type="number"
            step="0.000001"
            placeholder="0.6312"
            value={longitude ?? ""}
            onChange={(event) => {
              const parsed = Number.parseFloat(event.target.value);
              if (!Number.isNaN(parsed)) {
                onChange(latitude ?? DEFAULT_LATITUDE, parsed);
              }
            }}
          />
        </div>
      </div>

    </div>
  );
}
