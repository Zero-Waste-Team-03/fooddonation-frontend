import { useEffect, useMemo, useState } from "react";
import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import {
  Map,
  MapControls,
  useMap,
  type MapViewport,
} from "@/components/ui/map";
import type {
  DateRangeInput,
  DonationHeatmapCell,
  MapBoundsInput,
} from "@/gql/graphql";
import { useDonationsHeatmap } from "../hooks/useDonationsHeatmap";

type DonationsHeatmapMapProps = {
  categories?: string[];
  dateRange?: DateRangeInput;
  gridSize?: number;
};

const SOURCE_ID = "overview-donations-heatmap-source";
const LAYER_ID = "overview-donations-heatmap-layer";
const ALGERIA_CENTER: [number, number] = [3.0588445, 36.7729333];
const ALGERIA_DEFAULT_ZOOM = 4.8;

function toBoundsInput(map: MapLibreMap): MapBoundsInput {
  const bounds = map.getBounds();
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();

  return {
    northEast: { latitude: northEast.lat, longitude: northEast.lng },
    southWest: { latitude: southWest.lat, longitude: southWest.lng },
  };
}

function buildGeoJson(
  cells: DonationHeatmapCell[],
  maxScore: number,
): GeoJSON.FeatureCollection<
  GeoJSON.Point,
  { density: number; score: number; rawScore: number; donationCount: number }
> {
  const maxRawScore = Math.max(...cells.map((cell) => cell.rawScore), 1);
  const normalizedMax = maxScore > 0 ? maxScore : 1;

  return {
    type: "FeatureCollection",
    features: cells.map((cell) => {
      const normalizedByScore = cell.score / normalizedMax;
      const normalizedByRaw = cell.rawScore / maxRawScore;
      const density = Math.max(0, Math.min(1, Math.max(normalizedByScore, normalizedByRaw)));

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [cell.lng, cell.lat],
        },
        properties: {
          density,
          score: cell.score,
          rawScore: cell.rawScore,
          donationCount: cell.donationCount,
        },
      };
    }),
  };
}

function HeatmapBoundsSync({
  onBoundsChange,
}: {
  onBoundsChange: (bounds: MapBoundsInput) => void;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    const emitBounds = () => {
      onBoundsChange(toBoundsInput(map));
    };

    emitBounds();
    map.on("moveend", emitBounds);

    return () => {
      map.off("moveend", emitBounds);
    };
  }, [map, isLoaded, onBoundsChange]);

  return null;
}

function HeatmapLayer({
  cells,
  maxScore,
}: {
  cells: DonationHeatmapCell[];
  maxScore: number;
}) {
  const { map, isLoaded } = useMap();

  const geoJson = useMemo(() => buildGeoJson(cells, maxScore), [cells, maxScore]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    try {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "geojson",
          data: geoJson,
        });
      }

      if (!map.getLayer(LAYER_ID)) {
        map.addLayer({
          id: LAYER_ID,
          type: "heatmap",
          source: SOURCE_ID,
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "density"],
              0,
              0,
              1,
              1,
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              4,
              0.6,
              10,
              1.2,
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(99,153,34,0)",
              0.2,
              "#639922",
              0.45,
              "#BA7517",
              0.7,
              "#2d6a4f",
              1,
              "#D85A30",
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              4,
              18,
              8,
              30,
              12,
              48,
            ],
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              4,
              0.5,
              9,
              0.75,
              13,
              0.6,
            ],
          },
        });
      }
    } catch {
      return;
    }

    return () => {
      try {
        if (map.getLayer(LAYER_ID)) {
          map.removeLayer(LAYER_ID);
        }
        if (map.getSource(SOURCE_ID)) {
          map.removeSource(SOURCE_ID);
        }
      } catch {
        void 0;
      }
    };
  }, [map, isLoaded]);

  useEffect(() => {
    if (!map || !isLoaded) {
      return;
    }

    try {
      const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
      if (source) {
        source.setData(geoJson);
      }
    } catch {
      void 0;
    }
  }, [map, isLoaded, geoJson]);

  return null;
}

export function DonationsHeatmapMap({
  categories,
  dateRange,
  gridSize,
}: DonationsHeatmapMapProps) {
  const [bounds, setBounds] = useState<MapBoundsInput | null>(null);
  const [viewport, setViewport] = useState<Partial<MapViewport>>({
    center: ALGERIA_CENTER,
    zoom: ALGERIA_DEFAULT_ZOOM,
  });

  const { cells, maxScore, totalCells, loading, hasError } = useDonationsHeatmap({
    bounds,
    categories,
    dateRange,
    gridSize,
  });

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border" style={{ height: "420px" }}>
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
        </div>
      ) : null}
      {hasError ? (
        <div className="absolute left-3 top-3 z-10 rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-muted-foreground">
          Could not load heatmap data.
        </div>
      ) : null}
      {!loading && !hasError && totalCells === 0 ? (
        <div className="absolute left-3 top-3 z-10 rounded-md border border-border bg-card/95 px-3 py-2 text-xs text-muted-foreground">
          No heatmap activity in this viewport.
        </div>
      ) : null}
      <Map
        viewport={viewport}
        onViewportChange={setViewport}
        className="absolute inset-0"
      >
        <MapControls />
        <HeatmapBoundsSync onBoundsChange={setBounds} />
        <HeatmapLayer cells={cells} maxScore={maxScore} />
      </Map>
    </div>
  );
}
