import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  reportFiltersAtom,
  reportsPageAtom,
  selectedReportIdAtom,
} from "@/store";
import type { ReportFilters as ReportFiltersType } from "@/types/report.types";
import { ReportFilters } from "../components/ReportFilters";
import { ReportPagination } from "../components/ReportPagination";
import { ReportStatsBar } from "../components/ReportStatsBar";
import { ReportTable } from "../components/ReportTable";
import { ReportsChartCard } from "../components/ReportsChartCard";
import { useGrowthStats } from "../hooks/useGrowthStats";
import { useReports } from "../hooks/useReports";
import { useReportStats } from "../hooks/useReportStats";

function normalize(value: string | null | undefined): string {
  return (value ?? "").toLowerCase();
}

export function ReportsPage() {
  const { stats, loading: statsLoading } = useReportStats();
  const { data: growthData, loading: growthLoading } = useGrowthStats();
  const { reports, pagination, loading: reportsLoading } = useReports();
  const [filters, setFilters] = useAtom(reportFiltersAtom);
  const [, setPage] = useAtom(reportsPageAtom);
  const [, setSelectedReportId] = useAtom(selectedReportIdAtom);

  const filteredReports = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return reports.filter((report) => {
      const searchableFields = [
        report.id,
        report.reason,
        report.reporterId,
        report.targetId,
        report.targetType,
        report.status,
        report.description ?? "",
      ];

      const matchSearch =
        search === "" ||
        searchableFields.some((field) => normalize(field).includes(search));

      const matchStatus =
        filters.status === null || report.status === filters.status;

      const matchType =
        filters.type === null || report.targetType === filters.type;

      return matchSearch && matchStatus && matchType;
    });
  }, [reports, filters]);

  const handleFiltersChange = useCallback(
    (newFilters: ReportFiltersType) => {
      if (
        newFilters.search === filters.search &&
        newFilters.status === filters.status &&
        newFilters.type === filters.type
      ) {
        return;
      }

      setFilters(newFilters);
      setPage(1);
    },
    [filters, setFilters, setPage]
  );

  const handleReportAction = (reportId: string, action: string) => {
    setSelectedReportId(reportId);
    if (action === "view") {
      return;
    }
  };

  return (
    <PageWrapper
      title="Reports & analytics"
      description={`Monitor moderation activity across ${pagination?.totalCount ?? 0} reports.`}
    >
      <div className="flex flex-col -mt-2 pb-8 gap-6">
        <ReportStatsBar stats={stats} loading={statsLoading} />

        <ReportsChartCard
          data={growthData}
          reportSeries={stats?.chart ?? []}
          loading={statsLoading || growthLoading}
        />

        <ReportFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalCount={pagination?.totalCount ?? reports.length}
          filteredCount={filteredReports.length}
        />

        <ReportTable
          reports={filteredReports}
          loading={reportsLoading}
          onAction={handleReportAction}
        />

        {pagination && (
          <ReportPagination
            page={pagination.page}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={setPage}
          />
        )}
      </div>
    </PageWrapper>
  );
}
