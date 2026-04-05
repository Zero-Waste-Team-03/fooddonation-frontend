import { useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  createDonationDialogOpenAtom,
  deleteDonationDialogOpenAtom,
  donationFiltersAtom,
  donationsPageAtom,
  selectedDonationIdAtom,
} from "@/store";
import type { DonationFilters as DonationFiltersType } from "@/types/donation.types";

import { DonationStatsBar } from "../components/DonationStatsBar";
import { DonationFilters } from "../components/DonationFilters";
import { DonationTable } from "../components/DonationTable";
import { DonationPagination } from "../components/DonationPagination";
import { DeleteDonationDialog } from "../components/DeleteDonationDialog";
import { CreateDonationDialog } from "../components/CreateDonationDialog";

import { useDonationStats } from "../hooks/useDonationStats";
import { useDonations } from "../hooks/useDonations";
import { useDonationActions } from "../hooks/useDonationActions";

export function DonationsPage() {
  const navigate = useNavigate();
  const [createDonationDialogOpen, setCreateDonationDialogOpen] = useAtom(
    createDonationDialogOpenAtom
  );
  const [deleteDonationDialogOpen, setDeleteDonationDialogOpen] = useAtom(
    deleteDonationDialogOpenAtom
  );

  const [filters, setFilters] = useAtom(donationFiltersAtom);
  const [, setPage] = useAtom(donationsPageAtom);
  const selectedDonationId = useAtomValue(selectedDonationIdAtom);
  const setSelectedDonationId = useSetAtom(selectedDonationIdAtom);

  const { stats, loading: statsLoading } = useDonationStats();
  const { donations = [], pagination, loading: donationsLoading, refetch } = useDonations();
  const { handleDelete, loading: actionLoading, errorMessage, clearError } = useDonationActions();

  const filteredDonations = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    if (!q) {
      return donations;
    }
    return donations.filter((d) => {
      const title = d.title.toLowerCase();
      const id = d.id.toLowerCase();
      const desc = d.description.toLowerCase();
      const categoryName = d.category?.name.toLowerCase() ?? "";
      const categoryId = d.category?.id.toLowerCase() ?? "";
      return (
        title.includes(q) ||
        id.includes(q) ||
        desc.includes(q) ||
        categoryName.includes(q) ||
        categoryId.includes(q)
      );
    });
  }, [donations, filters.search]);

  const selectedDonation = useMemo(
    () => donations.find((d) => d.id === selectedDonationId) ?? null,
    [donations, selectedDonationId]
  );

  const handleFilterChange = useCallback(
    (newFilters: DonationFiltersType) => {
      if (
        newFilters.search === filters.search &&
        newFilters.status === filters.status &&
        newFilters.urgency === filters.urgency &&
        newFilters.category === filters.category
      ) {
        return;
      }

      setFilters(newFilters);
      setPage(1);
    },
    [
      filters.category,
      filters.search,
      filters.status,
      filters.urgency,
      setFilters,
      setPage,
    ]
  );

  const handleDeleteClick = (donationId: string) => {
    setSelectedDonationId(donationId);
    setDeleteDonationDialogOpen(true);
  };

  const handleDeleteConfirm = async (donationId: string) => {
    const ok = await handleDelete(donationId);
    if (ok) {
      setDeleteDonationDialogOpen(false);
      setSelectedDonationId(null);
      await refetch();
    }
  };

  const handleView = (donationId: string) => {
    navigate({
      to: "/donations/$donationId",
      params: { donationId },
    });
  };

  const customActions = (
    <Button
      className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
      onClick={() => setCreateDonationDialogOpen(true)}
    >
      <Plus className="mr-2 size-4" />
      New donation
    </Button>
  );

  return (
    <PageWrapper
      title="Donations"
      description={`Oversee ${pagination?.totalCount || 0} donation listings and donor activity.`}
      actions={customActions}
    >
      <div className="flex flex-col -mt-2 pb-8 gap-6">
        <DonationStatsBar stats={stats} loading={statsLoading} />

        <DonationFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          totalCount={pagination?.totalCount || 0}
          filteredCount={filteredDonations.length}
        />

        <DonationTable
          donations={filteredDonations}
          loading={donationsLoading}
          onDelete={handleDeleteClick}
          onView={handleView}
        />

        {pagination && (
          <DonationPagination
            page={pagination.page}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={setPage}
          />
        )}
      </div>

      <DeleteDonationDialog
        donation={selectedDonation}
        open={deleteDonationDialogOpen}
        onOpenChange={(open) => {
          setDeleteDonationDialogOpen(open);
          if (!open) clearError();
        }}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        errorMessage={errorMessage}
      />

      <CreateDonationDialog
        open={createDonationDialogOpen}
        onOpenChange={setCreateDonationDialogOpen}
      />
    </PageWrapper>
  );
}
