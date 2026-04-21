import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2, LocateFixed } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip, useMap } from "@/components/ui/map";
import type { DonationsMapQuery } from "@/gql/graphql";
import type { MapViewport } from "@/components/ui/map";
import type { Donation } from "@/types/donation.types";

type HeatmapMarker = NonNullable<DonationsMapQuery["donationsMap"]>[number];

type HeatmapQueryInput = {
  latitude: number;
  longitude: number;
  radius: number;
};

type DonationsHeatmapMapProps = {
  markers: HeatmapMarker[];
  donations: Donation[];
  loading: boolean;
  onRefetch?: (coords: HeatmapQueryInput) => void;
};

type HoverPopupState = {
  donationId: string;
  x: number;
  y: number;
};

const MOVE_END_DEBOUNCE_MS = 300;

function colorByMarker(markerColor: HeatmapMarker["markerColor"]): string {
  if (markerColor === "RED") return "var(--color-destructive)";
  if (markerColor === "ORANGE") return "var(--color-warning)";
  return "var(--color-success)";
}

function centerFromMarkers(markers: HeatmapMarker[]): [number, number] {
  if (!markers.length) {
    return [3.0588, 36.7538];
  }
  const longitude = markers.reduce((sum, marker) => sum + marker.longitude, 0) / markers.length;
  const latitude = markers.reduce((sum, marker) => sum + marker.latitude, 0) / markers.length;
  return [longitude, latitude];
}

function toDisplayText(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function computeRadiusKm(
  latitude: number,
  zoom: number,
  width: number,
  height: number,
): number {
  const safeWidth = Math.max(width, 1);
  const safeHeight = Math.max(height, 1);
  const halfDiagonalPx = Math.sqrt(safeWidth ** 2 + safeHeight ** 2) / 2;
  const metersPerPixel =
    (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / 2 ** zoom;
  const radiusKm = (halfDiagonalPx * metersPerPixel) / 1000;

  return Math.min(250, Math.max(1, Number(radiusKm.toFixed(2))));
}

function HeatmapRefetchListener({
  onRefetch,
}: {
  onRefetch?: (coords: HeatmapQueryInput) => void;
}) {
  const { map, isLoaded } = useMap();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onRefetchRef = useRef(onRefetch);
  onRefetchRef.current = onRefetch;

  const triggerRefetch = useCallback(() => {
    if (!map || !onRefetchRef.current) {
      return;
    }

    const center = map.getCenter();
    const container = map.getContainer();
    onRefetchRef.current({
      latitude: center.lat,
      longitude: center.lng,
      radius: computeRadiusKm(
        center.lat,
        map.getZoom(),
        container.clientWidth,
        container.clientHeight,
      ),
    });
  }, [map]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const handleMoveEnd = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        triggerRefetch();
      }, MOVE_END_DEBOUNCE_MS);
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      map.off("moveend", handleMoveEnd);
    };
  }, [map, isLoaded, triggerRefetch]);

  return null;
}

export function DonationsHeatmapMap({
  markers,
  donations,
  loading,
  onRefetch,
}: DonationsHeatmapMapProps) {
  const markersCenter = useMemo(() => centerFromMarkers(markers), [markers]);
  const navigate = useNavigate();
  const [viewport, setViewport] = useState<Partial<MapViewport>>({
    center: markersCenter,
    zoom: 10,
  });

  useEffect(() => {
    setViewport((current) => ({
      center: current.center ?? markersCenter,
      zoom: current.zoom ?? 10,
      bearing: current.bearing,
      pitch: current.pitch,
    }));
  }, [markersCenter]);

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoverPopup, setHoverPopup] = useState<HoverPopupState | null>(null);
  const hoveredDonationId = hoverPopup?.donationId ?? null;
  const hoveredDonation = useMemo(
    () => donations.find((donation) => donation.id === hoveredDonationId) ?? null,
    [donations, hoveredDonationId]
  );

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHidePopup = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setHoverPopup(null);
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const handleLocate = () => {
    if (!("geolocation" in navigator)) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setViewport((current) => ({
        ...current,
        center: [position.coords.longitude, position.coords.latitude],
        zoom: current.zoom != null && current.zoom > 11 ? current.zoom : 12,
      }));
    });
  };

  return (
    <Card className="rounded-2xl border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Donations Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="p-0 m-2 rounded-md ">
        <div className="relative h-[460px]  rounded-b-2xl">
          <div className="absolute right-3 top-3 z-30">
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 rounded-full border-border bg-primary shadow-dropdown backdrop-blur-sm"
              onClick={handleLocate}
              disabled={loading}
              aria-label="Use current device location"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <LocateFixed className="h-4 w-4" aria-hidden />
              )}
            </Button>
          </div>
          <Map
            viewport={viewport}
            onViewportChange={setViewport}
            className="absolute inset-0 min-h-full rounded-md"
            loading={loading}
          >
            <MapControls />
            <HeatmapRefetchListener onRefetch={onRefetch} />
            {markers.map((marker) => (
              <MapMarker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
                onMouseEnter={(event) => {
                  clearHideTimer();
                  const mapContainer = (event.currentTarget as HTMLElement).closest(".maplibregl-map");
                  if (!mapContainer) {
                    return;
                  }
                  const rect = mapContainer.getBoundingClientRect();
                  setHoverPopup({
                    donationId: marker.id,
                    x: event.clientX - rect.left + 12,
                    y: event.clientY - rect.top - 12,
                  });
                }}
                onMouseLeave={scheduleHidePopup}
                onClick={() =>
                  navigate({
                    to: "/donations/$donationId",
                    params: { donationId: marker.id },
                  })
                }
              >
                <MarkerContent>
                  <span
                    className="block h-3 w-3 rounded-full border-2 border-background shadow-card"
                    style={{ backgroundColor: colorByMarker(marker.markerColor) }}
                    aria-hidden
                  />
                </MarkerContent>
                <MarkerTooltip>{marker.title}</MarkerTooltip>
              </MapMarker>
            ))}
          </Map>
          {hoveredDonation && hoverPopup ? (
            <div
              className="absolute z-30 w-[280px] rounded-xl border bg-card shadow-dropdown overflow-hidden"
              style={{
                left: hoverPopup.x,
                top: hoverPopup.y,
                transform: "translate(0, -100%)",
              }}
              onMouseEnter={clearHideTimer}
              onMouseLeave={scheduleHidePopup}
            >
              <div className="h-[120px] bg-muted">
                {hoveredDonation.mainAttachment?.url ? (
                  <img
                    src={hoveredDonation.mainAttachment.url}
                    alt={hoveredDonation.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm font-semibold text-foreground line-clamp-2">{hoveredDonation.title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    Sensitivity:{" "}
                    {hoveredDonation.category?.sensitivity
                      ? toDisplayText(hoveredDonation.category.sensitivity)
                      : "Unknown"}
                  </span>
                  <span>•</span>
                  <span>Status: {toDisplayText(hoveredDonation.status)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Category: {hoveredDonation.category?.name ?? "Uncategorized"}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 w-full"
                  onClick={() =>
                    navigate({
                      to: "/donations/$donationId",
                      params: { donationId: hoveredDonation.id },
                    })
                  }
                >
                  View details
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
