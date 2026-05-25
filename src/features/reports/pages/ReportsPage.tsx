import { useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ReportTargetType } from "@/gql/graphql";
import { reportFiltersAtom, reportsPageAtom } from "@/store";
import type { Report, ReportFilters as ReportFiltersType } from "@/types/report.types";
import { ReportFilters } from "../components/ReportFilters";
import { ReportPagination } from "../components/ReportPagination";
import { ReportStatsBar } from "../components/ReportStatsBar";
import { ReportTable } from "../components/ReportTable";
import { ReportsChartCard } from "../components/ReportsChartCard";
import { useGrowthStats } from "../hooks/useGrowthStats";
import { useReportActions } from "../hooks/useReportActions";
import { useReports } from "../hooks/useReports";
import { useReportStats } from "../hooks/useReportStats";

function normalize(value: string | null | undefined): string {
  return (value ?? "").toLowerCase();
}

export function ReportsPage() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useReportStats();
  const { data: growthData, loading: growthLoading } = useGrowthStats();
  const { reports, pagination, loading: reportsLoading } = useReports();
  const { handleStatusChange, loading: statusUpdating } = useReportActions();
  const [filters, setFilters] = useAtom(reportFiltersAtom);
  const [, setPage] = useAtom(reportsPageAtom);

  const searchActive = filters.search.trim().length > 0;

  const filteredReports = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    if (!search) {
      return reports;
    }

    return reports.filter((report) => {
      const searchableFields = [
        report.id,
        report.reason,
        report.reporterId,
        report.reporter?.displayName ?? "",
        report.reporter?.email ?? "",
        report.targetId,
        report.targetType,
        report.status,
        report.description ?? "",
      ];

      return searchableFields.some((field) => normalize(field).includes(search));
    });
  }, [reports, filters.search]);

  const filteredCount = searchActive ? filteredReports.length : (pagination?.totalCount ?? reports.length);

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

  const handleReportRowClick = (report: Report) => {
    if (report.targetType === ReportTargetType.User) {
      navigate({
        to: "/users/$userId",
        params: { userId: report.targetId },
      });
      return;
    }

    if (report.targetType === ReportTargetType.Donation) {
      navigate({
        to: "/donations/$donationId",
        params: { donationId: report.targetId },
      });
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
          filteredCount={filteredCount}
        />

        <ReportTable
          reports={filteredReports}
          loading={reportsLoading}
          statusUpdating={statusUpdating}
          onRowClick={handleReportRowClick}
          onStatusChange={handleStatusChange}
        />

        {pagination ? (
          <ReportPagination
            page={pagination.page}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={setPage}
          />
        ) : null}
      </div>
    </PageWrapper>
  );
}
