import { createFileRoute } from "@tanstack/react-router";
import { ModerationPage } from "@/features/moderation/pages/ModerationPage";

export const Route = createFileRoute("/_protected/moderation")({
  component: ModerationPage,
});
