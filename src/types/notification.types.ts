import type { NotificationsQuery } from "@/gql/graphql";

export type Notification = NonNullable<NotificationsQuery["notifications"]>[number];
