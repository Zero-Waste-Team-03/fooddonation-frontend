import type { DocumentNode, OperationVariables } from "@apollo/client";

export type PaginatedFetchResult<TItem> = {
  items: TItem[];
  hasNextPage: boolean;
};

export type PaginatedFetchConfig<TData, TVariables extends OperationVariables, TItem> = {
  query: DocumentNode;
  buildVariables: (page: number, limit: number) => TVariables;
  extractPage: (data: TData) => PaginatedFetchResult<TItem> | null | undefined;
};

export async function fetchAllPaginated<TData, TVariables extends OperationVariables, TItem>(
  limit: number,
  config: PaginatedFetchConfig<TData, TVariables, TItem>
): Promise<TItem[]> {
  const allItems: TItem[] = [];
  let page = 1;

  const { apolloClient } = await import("@/lib/apolloClient");

  while (true) {
    const { data } = await apolloClient.query<TData, TVariables>({
      query: config.query,
      variables: config.buildVariables(page, limit),
      fetchPolicy: "network-only",
    });

    if (!data) {
      break;
    }

    const pageResult = config.extractPage(data);
    if (!pageResult) {
      break;
    }

    allItems.push(...pageResult.items);

    if (!pageResult.hasNextPage) {
      break;
    }

    page += 1;
  }

  return allItems;
}
