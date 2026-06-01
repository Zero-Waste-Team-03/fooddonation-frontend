import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type Theme = "light" | "dark" | "system";

export const themeAtom = atomWithStorage<Theme>("theme", "system");

export const globalExportDialogOpenAtom = atom<boolean>(false);
