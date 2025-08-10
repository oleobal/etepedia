import { writable, Writable } from "svelte/store";
import * as Etebase from "etebase";
import { Directory, DirectoryID, PageID } from "./lib/eb";
import { persisted } from "svelte-persisted-store";
import { UserSettings } from "./lib/settings";

// svelte-persisted-store doesn't export it for some reason
interface Persisted<T> extends Writable<T> {
  reset: () => void;
}

export let etebaseState = $state({
  etebaseAccount: null as (Etebase.Account | null),
  directoriesById: null as (Map<DirectoryID, Directory> | null),
  currentDirectory: null as (Directory | null),
  pagesById: new Map<PageID, Directory>(),
});

export const savedEtebaseSession: Persisted<string> = persisted(
  "saved-etebase-session",
  null
);

export const userSettings: Persisted<UserSettings> = persisted(
  "user-settings",
  new UserSettings()
);
