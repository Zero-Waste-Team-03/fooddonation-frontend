import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.gaspzero.qzz.io/graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/gql/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withMutationFn: false,
        withResultType: false,
        withMutationOptionsType: false,
        withRefetchFn: true,
        reactApolloVersion: 3,
        apolloReactHooksImportFrom: "@apollo/client/react",
        scalars: {
          DateTime: "string",
          JSON: "Record<string, unknown>",
        },
      },
    },
    "src/gql/introspection.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
