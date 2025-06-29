// lib/atoms.ts
import { atom } from "jotai";

export interface User {
  id: string;
  username: string;
  email: string;
}

export const userAtom = atom<User | null>(null);
export const loadingAtom = atom<boolean>(true);
