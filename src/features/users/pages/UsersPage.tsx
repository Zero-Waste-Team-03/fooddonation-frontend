import { UserPlus } from "lucide-react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { createUserDialogOpenAtom } from "@/store";

import { UserStats } from "../components/UserStats";
import { UserFilters } from "../components/UserFilters";
import { UserTable } from "../components/UserTable";
import { CreateUserDialog, type CreateUserFormValues } from "../components/CreateUserDialog";

export function UsersPage() {
  const [createUserDialogOpen, setCreateUserDialogOpen] = useAtom(createUserDialogOpenAtom);

  const handleCreateUserSubmit = async (data: CreateUserFormValues): Promise<void> => {
    console.log("Create user submit", data);
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
      description="Oversee 1,240 platform members and their activity."
      actions={customActions}
    >
      <div className="flex flex-col -mt-2 pb-8">
        <UserStats />
        <UserFilters />
        <UserTable />
      </div>

      <CreateUserDialog
        open={createUserDialogOpen}
        onOpenChange={setCreateUserDialogOpen}
        onSubmit={handleCreateUserSubmit}
      />
    </PageWrapper>
  );
}
