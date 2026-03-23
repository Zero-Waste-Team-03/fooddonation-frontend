import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const graphqlFilePath = resolve("src/gql/graphql.ts");

const source = readFileSync(graphqlFilePath, "utf8");

const withoutApolloImport = source.replace(
  /\r?\nimport \* as Apollo from '@apollo\/client';/g,
  ""
);

const withoutSuspenseOverloadDeclarations = withoutApolloImport
  .replace(/\r?\n\/\/ @ts-ignore/g, "")
  .replace(
    /\r?\nexport function use[A-Za-z0-9_]*SuspenseQuery\([^\n]*\):[^\n]*;/g,
    ""
  );

writeFileSync(graphqlFilePath, withoutSuspenseOverloadDeclarations, "utf8");
