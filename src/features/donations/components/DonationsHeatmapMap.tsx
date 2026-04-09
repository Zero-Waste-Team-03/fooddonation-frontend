import { useEffect, useMemo, useState } from "react";
import { LocateFixed, RefreshCcw } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, MapControls, MapMarker, MarkerContent, MarkerTooltip } from "@/components/ui/map";
import type { DonationsMapQuery } from "@/gql/graphql";
import type { MapViewport } from "@/components/ui/map";

type HeatmapMarker = NonNullable<DonationsMapQuery["donationsMap"]>[number];

type DonationsHeatmapMapProps = {
  markers: HeatmapMarker[];
  loading: boolean;
  onRefetch?: (coords: { latitude: number; longitude: number }) => void;
  onLocateRequest?: (coords: { latitude: number; longitude: number }) => void;
};

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

export function DonationsHeatmapMap({
  markers,
  loading,
  onRefetch,
  onLocateRequest,
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

  const currentCenter = viewport.center ?? markersCenter;

  const handleRefetch = () => {
    onRefetch?.({
      latitude: currentCenter[1],
      longitude: currentCenter[0],
    });
  };

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
      onLocateRequest?.({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  return (
    <Card className="rounded-2xl border bg-card">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">Donations Activity Heatmap</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleLocate}
            disabled={loading}
          >
            <LocateFixed className="mr-2 h-4 w-4" />
            My location
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9"
            onClick={handleRefetch}
            disabled={loading}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refetch
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 m-2 rounded-md overflow-hidden">
        <div className="relative h-[460px] overflow-hidden rounded-b-2xl">
          <Map
            viewport={viewport}
            onViewportChange={setViewport}
            className="absolute inset-0 min-h-full"
            loading={loading}
          >
            <MapControls />
            {markers.map((marker) => (
              <MapMarker
                key={marker.id}
                longitude={marker.longitude}
                latitude={marker.latitude}
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
        </div>
      </CardContent>
    </Card>
  );
}
