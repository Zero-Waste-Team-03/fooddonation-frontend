import { createFileRoute } from "@tanstack/react-router";
import { UserDetailPage } from "@/features/users/pages/UserDetailPage";

export const Route = createFileRoute("/_protected/users/$userId")({
  component: UserDetailPage,
});
