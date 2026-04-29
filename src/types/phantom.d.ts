import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
