import { useCallback, useMemo } from "react";
import { UserPlus } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import {
  createUserDialogOpenAtom,
  userFiltersAtom,
  usersPageAtom,
  selectedUserIdAtom,
  suspendUserDialogOpenAtom,
  activateUserDialogOpenAtom,
  sendNotificationDialogOpenAtom,
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

export function UsersPage() {
  // Dialog states
  const [createUserDialogOpen, setCreateUserDialogOpen] = useAtom(createUserDialogOpenAtom);
  const [suspendUserDialogOpen, setSuspendUserDialogOpen] = useAtom(suspendUserDialogOpenAtom);
  const [activateUserDialogOpen, setActivateUserDialogOpen] = useAtom(activateUserDialogOpenAtom);
  const [sendNotificationDialogOpen, setSendNotificationDialogOpen] = useAtom(sendNotificationDialogOpenAtom);

  // User filters and pagination
  const [filters, setFilters] = useAtom(userFiltersAtom);
  const [, setPage] = useAtom(usersPageAtom);
  const selectedUserId = useAtomValue(selectedUserIdAtom);
  const setSelectedUserId = useSetAtom(selectedUserIdAtom);

  // Data hooks
  const { stats, loading: statsLoading } = useUserStats();
  const { users = [], pagination, loading: usersLoading, refetch } = useUsers();
  const { handleSuspend, handleActivate, handleSendNotification, loading: actionLoading, errorMessage, clearError } = useUserActions();

  // Get selected user for dialogs
  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  // Client-side filter (basic search in case API doesn't filter perfectly)
  const filteredUsers = useMemo(() => {
    if (!filters.search) return users;
    const search = filters.search.toLowerCase();
    return users.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.location?.city?.toLowerCase().includes(search)
    );
  }, [users, filters.search]);

  const handleFilterChange = useCallback((newFilters: UserFiltersType) => {
    if (
      newFilters.search === filters.search &&
      newFilters.role === filters.role &&
      newFilters.status === filters.status
    ) {
      return;
    }

    setFilters(newFilters);
    setPage(1);
  }, [filters.role, filters.search, filters.status, setFilters, setPage]);

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
    <Button
      className="h-10 rounded-xl px-5 font-semibold shadow-card"
      onClick={() => setCreateUserDialogOpen(true)}
    >
      <UserPlus className="mr-2 size-4" />
      Add New User
    </Button>
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
          filteredCount={filteredUsers.length}
        />

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          loading={usersLoading}
          onSuspend={(userId) => handleUserAction(userId, "suspend")}
          onActivate={(userId) => handleUserAction(userId, "activate")}
          onSendNotification={(userId) => handleUserAction(userId, "notify")}
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
    </PageWrapper>
  );
}
