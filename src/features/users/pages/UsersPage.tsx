import { useCallback, useMemo } from "react";
import { Download, UserPlus } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { ListExportDialog } from "@/components/export/ListExportDialog";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { EXPORT_LABELS } from "@/constants/export.constants";
import {
  createUserDialogOpenAtom,
  userFiltersAtom,
  usersPageAtom,
  selectedUserIdAtom,
  suspendUserDialogOpenAtom,
  activateUserDialogOpenAtom,
  sendNotificationDialogOpenAtom,
  usersExportDialogOpenAtom,
} from "@/store/atoms/users.atoms";
import type { UserFilters as UserFiltersType } from "@/types/user.types";

import { UserStatsBar } from "../components/UserStatsBar";
import { UserFilters } from "../components/UserFilters";
import { UserTable } from "../components/UserTable";
import { UserPagination } from "../components/UserPagination";
import { BanUserDialog } from "../components/BanUserDialog";
import { PromoteUserDialog } from "../components/PromoteUserDialog";
import { SendNotificationDialog } from "../components/SendNotificationDialog";
import { CreateUserDialog } from "../components/CreateUserDialog";

import { useUserStats } from "../hooks/useUserStats";
import { useUsers } from "../hooks/useUsers";
import { useUserActions } from "../hooks/useUserActions";
import { useUserVerificationActions } from "../hooks/useUserVerificationActions";
import { useUsersListExport } from "../hooks/useUsersListExport";
import { matchesVerificationStatusFilter } from "@/constants/users.constants";
import type { User } from "@/types/user.types";

export function UsersPage() {
  // Dialog states
  const [createUserDialogOpen, setCreateUserDialogOpen] = useAtom(createUserDialogOpenAtom);
  const [suspendUserDialogOpen, setSuspendUserDialogOpen] = useAtom(suspendUserDialogOpenAtom);
  const [activateUserDialogOpen, setActivateUserDialogOpen] = useAtom(activateUserDialogOpenAtom);
  const [sendNotificationDialogOpen, setSendNotificationDialogOpen] = useAtom(sendNotificationDialogOpenAtom);
  const [exportDialogOpen, setExportDialogOpen] = useAtom(usersExportDialogOpenAtom);

  // User filters and pagination
  const [filters, setFilters] = useAtom(userFiltersAtom);
  const [, setPage] = useAtom(usersPageAtom);
  const selectedUserId = useAtomValue(selectedUserIdAtom);
  const setSelectedUserId = useSetAtom(selectedUserIdAtom);

  // Data hooks
  const { stats, loading: statsLoading } = useUserStats();
  const { users = [], pagination, loading: usersLoading, refetch } = useUsers();
  const { handleSuspend, handleActivate, handleSendNotification, loading: actionLoading, errorMessage, clearError } = useUserActions();
  const {
    handleToggleFoodSaver,
    handleToggleVerification,
    loading: verificationActionLoading,
  } = useUserVerificationActions();
  const {
    loading: exportLoading,
    errorMessage: exportErrorMessage,
    exportCurrentPage,
    exportEntireList,
  } = useUsersListExport();

  // Get selected user for dialogs
  const verificationFilterActive = filters.verificationStatus !== null;

  const filteredUsers = useMemo(() => {
    if (!verificationFilterActive) {
      return users;
    }

    return users.filter((user: User) =>
      matchesVerificationStatusFilter(user, filters.verificationStatus)
    );
  }, [users, filters.verificationStatus, verificationFilterActive]);

  const filteredCount = verificationFilterActive
    ? filteredUsers.length
    : users.length;

  const selectedUser = useMemo(
    () => filteredUsers.find((u) => u.id === selectedUserId) ?? users.find((u) => u.id === selectedUserId) ?? null,
    [filteredUsers, users, selectedUserId]
  );

  const handleFilterChange = useCallback((newFilters: UserFiltersType) => {
    if (
      newFilters.search === filters.search &&
      newFilters.role === filters.role &&
      newFilters.status === filters.status &&
      newFilters.verificationStatus === filters.verificationStatus
    ) {
      return;
    }

    setFilters(newFilters);
    setPage(1);
  }, [
    filters.role,
    filters.search,
    filters.status,
    filters.verificationStatus,
    setFilters,
    setPage,
  ]);

  const handleUserAction = (userId: string, action: "suspend" | "activate" | "notify") => {
    setSelectedUserId(userId);
    if (action === "suspend") {
      setSuspendUserDialogOpen(true);
    } else if (action === "activate") {
      setActivateUserDialogOpen(true);
    } else if (action === "notify") {
      setSendNotificationDialogOpen(true);
    }
  };

  const handleSuspendConfirm = async (userId: string) => {
    await handleSuspend(userId);
    if (!errorMessage) {
      setSuspendUserDialogOpen(false);
      setSelectedUserId("");
      await refetch();
    }
  };

  const handleActivateConfirm = async (userId: string) => {
    await handleActivate(userId);
    if (!errorMessage) {
      setActivateUserDialogOpen(false);
      setSelectedUserId("");
      await refetch();
    }
  };

  const handleSendNotificationConfirm = async (userId: string, title: string, body: string, type: string) => {
    await handleSendNotification(userId, title, body, type);
    if (!errorMessage) {
      setSendNotificationDialogOpen(false);
      setSelectedUserId("");
    }
  };

  const customActions = (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold"
        onClick={() => setExportDialogOpen(true)}
      >
        <Download className="mr-2 size-4" />
        {EXPORT_LABELS.exportButton}
      </Button>
      <Button
        className="h-11 min-h-11 rounded-xl px-6 text-sm font-semibold shadow-card"
        onClick={() => setCreateUserDialogOpen(true)}
      >
        <UserPlus className="mr-2 size-4" />
        Add New User
      </Button>
    </div>
  );

  return (
    <PageWrapper
      title="User Management"
      description={`Oversee ${pagination?.totalCount || 0} platform members and their activity.`}
      actions={customActions}
    >
      <div className="flex flex-col -mt-2 pb-8 gap-6">
        {/* Stats Bar */}
        <UserStatsBar stats={stats} loading={statsLoading} />

        {/* Filters */}
        <UserFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
          totalCount={pagination?.totalCount || 0}
          filteredCount={filteredCount}
        />

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          loading={usersLoading || verificationActionLoading}
          onSuspend={(userId) => handleUserAction(userId, "suspend")}
          onActivate={(userId) => handleUserAction(userId, "activate")}
          onSendNotification={(userId) => handleUserAction(userId, "notify")}
          onToggleFoodSaver={handleToggleFoodSaver}
          onToggleVerification={handleToggleVerification}
        />

        {/* Pagination */}
        {pagination && (
          <UserPagination
            page={pagination.page}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Dialogs */}
      <BanUserDialog
        user={selectedUser}
        open={suspendUserDialogOpen}
        onOpenChange={(open) => {
          setSuspendUserDialogOpen(open);
          if (!open) clearError();
        }}
        onConfirm={handleSuspendConfirm}
        loading={actionLoading}
        errorMessage={errorMessage}
      />

      <PromoteUserDialog
        user={selectedUser}
        open={activateUserDialogOpen}
        onOpenChange={(open) => {
          setActivateUserDialogOpen(open);
          if (!open) clearError();
        }}
        onConfirm={handleActivateConfirm}
        loading={actionLoading}
        errorMessage={errorMessage}
      />

      <SendNotificationDialog
        user={selectedUser}
        open={sendNotificationDialogOpen}
        onOpenChange={(open) => {
          setSendNotificationDialogOpen(open);
          if (!open) clearError();
        }}
        onConfirm={handleSendNotificationConfirm}
        loading={actionLoading}
        errorMessage={errorMessage}
      />

      <CreateUserDialog
        open={createUserDialogOpen}
        onOpenChange={setCreateUserDialogOpen}
      />

      <ListExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        title={EXPORT_LABELS.listDialogTitle}
        loading={exportLoading}
        errorMessage={exportErrorMessage}
        onExportCurrentPage={() => exportCurrentPage(filteredUsers)}
        onExportEntireList={() => void exportEntireList()}
      />
    </PageWrapper>
  );
}
