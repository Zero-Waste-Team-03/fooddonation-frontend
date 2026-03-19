import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const accessTokenAtom = atomWithStorage<string | null>(
  "access_token",
  null
);

export const isAuthenticatedAtom = atom(
  (get) => get(accessTokenAtom) !== null
);
