import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const graphqlFilePath = resolve("src/gql/graphql.ts");

let source = readFileSync(graphqlFilePath, "utf8");

// Remove Apollo import
source = source.replace(
  /\r?\nimport \* as Apollo from '@apollo\/client';/g,
  ""
);

// Remove all SuspenseQuery overload signatures
source = source.replace(
  /export function use[A-Za-z0-9_]*SuspenseQuery\([^)]*\):[^\n]*\n/g,
  ""
);

// Remove all SuspenseQuery function implementations
// This pattern matches: export function name(...) { ... }
source = source.replace(
  /export function use[A-Za-z0-9_]*SuspenseQuery\([^)]*\)\s*\{[^}]*\n\s*\}/g,
  ""
);

// Remove all *SuspenseQueryHookResult type exports
source = source.replace(
  /export type [A-Za-z0-9_]*SuspenseQueryHookResult[^\n]*;\n/g,
  ""
);

source = source.replace(/^\s*\/\/\s*@ts-ignore.*\r?\n/gm, "");
source = source.replace(/^\s*\/\/\s*@ts-expect-error.*\r?\n/gm, "");

// Remove updatedAt field from Attachment type
source = source.replace(
  /(\s+\/\*\* Date the attachment was last updated \*\/\r?\n\s+updatedAt: Scalars\['DateTime'\]\['output'\];?\r?\n)/g,
  ""
);

writeFileSync(graphqlFilePath, source, "utf8");
