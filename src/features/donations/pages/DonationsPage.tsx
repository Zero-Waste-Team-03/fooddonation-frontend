import { useCallback, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  createCategoryDialogOpenAtom,
  createDonationDialogOpenAtom,
  deleteCategoryDialogOpenAtom,
  deleteDonationDialogOpenAtom,
  donationFiltersAtom,
  donationsPageAtom,
  selectedCategoryIdAtom,
  selectedDonationIdAtom,
} from "@/store";
import type { DonationFilters as DonationFiltersType } from "@/types/donation.types";

import { CategoryTable } from "../components/CategoryTable";
import { CreateCategoryDialog } from "../components/CreateCategoryDialog";
import { DeleteCategoryDialog } from "../components/DeleteCategoryDialog";
import { DonationStatsBar } from "../components/DonationStatsBar";
import { DonationFilters } from "../components/DonationFilters";
import { DonationsHeatmapMap } from "../components/DonationsHeatmapMap";
import { DonationTable } from "../components/DonationTable";
import { DonationPagination } from "../components/DonationPagination";
import { DeleteDonationDialog } from "../components/DeleteDonationDialog";
import { CreateDonationDialog } from "../components/CreateDonationDialog";

import { useCategories } from "../hooks/useCategories";
import { useCategoryActions } from "../hooks/useCategoryActions";
import { useDonationStats } from "../hooks/useDonationStats";
import { useDonations } from "../hooks/useDonations";
import { useDonationActions } from "../hooks/useDonationActions";
import { useDonationsHeatmap } from "../hooks/useDonationsHeatmap";

export function DonationsPage() {
  const [activeTab, setActiveTab] = useState<"donations" | "categories">("donations");
  const [donationsViewTab, setDonationsViewTab] = useState<"map" | "list">("list");
  const navigate = useNavigate();
  const [createDonationDialogOpen, setCreateDonationDialogOpen] = useAtom(
    createDonationDialogOpenAtom
  );
  const [deleteDonationDialogOpen, setDeleteDonationDialogOpen] = useAtom(
    deleteDonationDialogOpenAtom
  );
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useAtom(
    createCategoryDialogOpenAtom
  );
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useAtom(
    deleteCategoryDialogOpenAtom
  );

  const [filters, setFilters] = useAtom(donationFiltersAtom);
  const [, setPage] = useAtom(donationsPageAtom);
  const selectedDonationId = useAtomValue(selectedDonationIdAtom);
  const selectedCategoryId = useAtomValue(selectedCategoryIdAtom);
  const setSelectedDonationId = useSetAtom(selectedDonationIdAtom);
  const setSelectedCategoryId = useSetAtom(selectedCategoryIdAtom);

  const { stats, loading: statsLoading } = useDonationStats();
  const {
    data: heatmapData,
    loading: heatmapLoading,
    refetch: refetchHeatmap,
  } = useDonationsHeatmap();
  const { donations = [], pagination, loading: donationsLoading, refetch } = useDonations();
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { handleDelete, loading: actionLoading, errorMessage, clearError } = useDonationActions();
  const {
    handleDelete: handleDeleteCategory,
    loading: categoryActionLoading,
    errorMessage: categoryErrorMessage,
    clearError: clearCategoryError,
  } = useCategoryActions();

  const filteredDonations = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    if (!q) {
      return donations;
    }
    return donations.filter((d) => {
      const title = d.title.toLowerCase();
      const desc = d.description.toLowerCase();
      const categoryName = d.category?.name.toLowerCase() ?? "";
      return (
        title.includes(q) ||
        desc.includes(q) ||
        categoryName.includes(q)
      );
    });
  }, [donations, filters.search]);

  const selectedDonation = useMemo(
    () => donations.find((d) => d.id === selectedDonationId) ?? null,
    [donations, selectedDonationId]
  );
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
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
      onClick={() =>
        activeTab === "donations"
          ? setCreateDonationDialogOpen(true)
          : setCreateCategoryDialogOpen(true)
      }
    >
      <Plus className="mr-2 size-4" />
      {activeTab === "donations" ? "New donation" : "New category"}
    </Button>
  );

  const handleDeleteCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setDeleteCategoryDialogOpen(true);
  };

  const handleDeleteCategoryConfirm = async (categoryId: string) => {
    const ok = await handleDeleteCategory(categoryId);
    if (ok) {
      setDeleteCategoryDialogOpen(false);
      setSelectedCategoryId(null);
      await refetchCategories();
      await refetch();
    }
  };

  return (
    <PageWrapper
      title="Donations"
      description={`Oversee ${pagination?.totalCount || 0} donation listings and donor activity.`}
      actions={customActions}
    >
      <div className="flex flex-col -mt-2 pb-8 gap-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "donations" | "categories")}>
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="donations" className="space-y-6">
            <DonationStatsBar stats={stats} loading={statsLoading} />
            <Tabs
              value={donationsViewTab}
              onValueChange={(value) => setDonationsViewTab(value as "map" | "list")}
            >
              <TabsList>
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <TabsContent value="map">
                <DonationsHeatmapMap
                  markers={heatmapData}
                  donations={donations}
                  loading={heatmapLoading}
                  onRefetch={({ latitude, longitude }) => {
                    void refetchHeatmap({
                      input: {
                        latitude,
                        longitude,
                        radius: 50,
                      },
                    });
                  }}
                  onLocateRequest={({ latitude, longitude }) => {
                    void refetchHeatmap({
                      input: {
                        latitude,
                        longitude,
                        radius: 50,
                      },
                    });
                  }}
                />
              </TabsContent>
              <TabsContent value="list" className="space-y-6">
                <DonationFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  totalCount={pagination?.totalCount || 0}
                  filteredCount={filteredDonations.length}
                  categories={categories}
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
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="categories">
            <CategoryTable
              categories={categories}
              loading={categoriesLoading}
              onDelete={handleDeleteCategoryClick}
            />
          </TabsContent>
        </Tabs>
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

      <CreateCategoryDialog
        open={createCategoryDialogOpen}
        onOpenChange={setCreateCategoryDialogOpen}
      />

      <DeleteCategoryDialog
        category={selectedCategory}
        open={deleteCategoryDialogOpen}
        onOpenChange={(open) => {
          setDeleteCategoryDialogOpen(open);
          if (!open) clearCategoryError();
        }}
        onConfirm={handleDeleteCategoryConfirm}
        loading={categoryActionLoading}
        errorMessage={categoryErrorMessage}
      />
    </PageWrapper>
  );
}
