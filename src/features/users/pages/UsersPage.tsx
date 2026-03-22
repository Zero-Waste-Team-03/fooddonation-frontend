import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/layout/PageWrapper";

import { UserStats } from "../components/UserStats";
import { UserFilters } from "../components/UserFilters";
import { UserTable } from "../components/UserTable";
import { NewUserDialog } from "../components/NewUserDialog";

export function UsersPage() {
  const customActions = (
    <NewUserDialog>
      <Button className="h-10 rounded-xl bg-[#1e6047] hover:bg-[#164a36] text-white shadow-sm px-5 font-semibold transition-colors">
        <UserPlus className="mr-2 size-4" />
        Add New User
      </Button>
    </NewUserDialog>
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
    </PageWrapper>
  );
}
