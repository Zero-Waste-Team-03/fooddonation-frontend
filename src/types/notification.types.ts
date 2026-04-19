import type { NotificationsQuery } from "@/gql/graphql";

export type Notification = NonNullable<
	NonNullable<NotificationsQuery["getNotifications"]>["items"]
>[number];
