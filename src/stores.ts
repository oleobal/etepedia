import { writable, Writable } from "svelte/store";
import * as Etebase from "etebase";
import { Directory } from "./lib/eb";
import { persisted } from "svelte-persisted-store";

export const etebaseAccount: Writable<Etebase.Account | null> = writable(null);
export const directories: Writable<Directory[] | null> = writable(null);
export const currentDirectory: Writable<Directory | null> = writable(null);

export const savedEtebaseSession: any = persisted(
  "saved-etebase-session",
  null
);
