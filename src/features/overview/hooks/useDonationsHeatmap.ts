import { useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import {
  DonationsHeatmapDocument,
  type DonationsHeatmapQuery,
  type DonationsHeatmapQueryVariables,
  type DateRangeInput,
  type DonationHeatmapCell,
  type MapBoundsInput,
} from "@/gql/graphql";

type UseDonationsHeatmapArgs = {
  bounds?: MapBoundsInput | null;
  categories?: string[];
  dateRange?: DateRangeInput;
  gridSize?: number;
};

type UseDonationsHeatmapResult = {
  cells: DonationHeatmapCell[];
  maxScore: number;
  totalCells: number;
  loading: boolean;
  hasError: boolean;
};

export function useDonationsHeatmap({
  bounds,
  categories,
  dateRange,
  gridSize,
}: UseDonationsHeatmapArgs): UseDonationsHeatmapResult {
  const [fetchHeatmap, { data, loading, error }] = useLazyQuery<
    DonationsHeatmapQuery,
    DonationsHeatmapQueryVariables
  >(
    DonationsHeatmapDocument,
    {
      fetchPolicy: "network-only",
    },
  );

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const input = {
      bounds,
      ...(categories && categories.length > 0 ? { categories } : {}),
      ...(dateRange ? { dateRange } : {}),
      ...(typeof gridSize === "number" ? { gridSize } : {}),
    };

    void fetchHeatmap({ variables: { input } });
  }, [
    bounds,
    fetchHeatmap,
    categories,
    dateRange,
    gridSize,
  ]);

  return {
    cells: data?.donationsHeatmap.cells ?? [],
    maxScore: data?.donationsHeatmap.maxScore ?? 0,
    totalCells: data?.donationsHeatmap.totalCells ?? 0,
    loading,
    hasError: Boolean(error),
  };
}
