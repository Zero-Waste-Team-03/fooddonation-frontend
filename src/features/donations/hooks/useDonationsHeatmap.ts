import { useDonationsMapQuery } from "@/gql/graphql";

const DEFAULT_LATITUDE = 36.7538;
const DEFAULT_LONGITUDE = 3.0588;
const DEFAULT_ZOOM = 10;
const DEFAULT_MAP_WIDTH_PX = 960;
const DEFAULT_MAP_HEIGHT_PX = 460;

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

const DEFAULT_INPUT = {
  latitude: DEFAULT_LATITUDE,
  longitude: DEFAULT_LONGITUDE,
  radius: computeRadiusKm(
    DEFAULT_LATITUDE,
    DEFAULT_ZOOM,
    DEFAULT_MAP_WIDTH_PX,
    DEFAULT_MAP_HEIGHT_PX,
  ),
} as const;

export function useDonationsHeatmap() {
  const { data, loading, error, refetch } = useDonationsMapQuery({
    variables: {
      input: DEFAULT_INPUT,
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    data: data?.donationsMap ?? [],
    loading,
    error,
    refetch,
  };
}
