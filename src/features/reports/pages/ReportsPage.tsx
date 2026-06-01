import { useCallback, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { ListExportDialog } from "@/components/export/ListExportDialog";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { EXPORT_LABELS } from "@/constants/export.constants";
import { ReportAction } from "@/constants/reports.constants";
import { ReportTargetType } from "@/gql/graphql";
import { reportFiltersAtom, reportsExportDialogOpenAtom, reportsPageAtom } from "@/store";
import type { Report, ReportFilters as ReportFiltersType } from "@/types/report.types";
import { BanUserFromReportDialog } from "../components/BanUserFromReportDialog";
import { ReportFilters } from "../components/ReportFilters";
import { ReportPagination } from "../components/ReportPagination";
import { ReportStatsBar } from "../components/ReportStatsBar";
import { ReportTable } from "../components/ReportTable";
import { ReportsChartCard } from "../components/ReportsChartCard";
import { useGrowthStats } from "../hooks/useGrowthStats";
import { useReportActions } from "../hooks/useReportActions";
import { useReports } from "../hooks/useReports";
import { useReportStats } from "../hooks/useReportStats";
import { useReportsListExport } from "../hooks/useReportsListExport";
import { filterReportsBySearch } from "../utils/matchesReportSearchFilter";

export function ReportsPage() {
  const navigate = useNavigate();
  const { stats, loading: statsLoading } = useReportStats();
  const { data: growthData, loading: growthLoading } = useGrowthStats();
  const { reports, pagination, loading: reportsLoading } = useReports();
  const {
    handleReportAction,
    handleBanUser,
    loading: actionsLoading,
    banErrorMessage,
    clearBanError,
  } = useReportActions();
  const [filters, setFilters] = useAtom(reportFiltersAtom);
  const [, setPage] = useAtom(reportsPageAtom);
  const [banReport, setBanReport] = useState<Report | null>(null);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useAtom(reportsExportDialogOpenAtom);

  const {
    loading: exportLoading,
    errorMessage: exportErrorMessage,
    exportCurrentPage,
    exportEntireList,
  } = useReportsListExport();

  const searchActive = filters.search.trim().length > 0;

  const filteredReports = useMemo(
    () => filterReportsBySearch(reports, filters.search),
    [reports, filters.search]
  );

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

  const handleReportActionWithBan = async (report: Report, action: ReportAction) => {
    if (action === ReportAction.BanUser) {
      setBanReport(report);
      setBanDialogOpen(true);
      return;
    }

    await handleReportAction(report, action);
  };

  const handleBanConfirm = async (report: Report) => {
    const success = await handleBanUser(report);
    if (success) {
      setBanDialogOpen(false);
      setBanReport(null);
      clearBanError();
    }
  };

  const pageActions = (
    <Button
      type="button"
      variant="outline"
      className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
      onClick={() => setExportDialogOpen(true)}
    >
      <Download className="mr-2 size-4" />
      {EXPORT_LABELS.exportButton}
    </Button>
  );

  return (
    <PageWrapper
      title="Reports & analytics"
      description={`Monitor moderation activity across ${pagination?.totalCount ?? 0} reports.`}
      actions={pageActions}
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
          actionsLoading={actionsLoading}
          onRowClick={handleReportRowClick}
          onReportAction={handleReportActionWithBan}
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

      <BanUserFromReportDialog
        report={banReport}
        open={banDialogOpen}
        onOpenChange={(open) => {
          setBanDialogOpen(open);
          if (!open) {
            setBanReport(null);
            clearBanError();
          }
        }}
        onConfirm={handleBanConfirm}
        loading={actionsLoading}
        errorMessage={banErrorMessage}
      />

      <ListExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        title={EXPORT_LABELS.listDialogTitle}
        loading={exportLoading}
        errorMessage={exportErrorMessage}
        onExportCurrentPage={() => exportCurrentPage(filteredReports)}
        onExportEntireList={() => void exportEntireList()}
      />
    </PageWrapper>
  );
}
