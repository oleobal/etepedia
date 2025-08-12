import { Writable } from "svelte/store";
import * as Etebase from "etebase";
import { Directory, DirectoryID, PageID, Page } from "./lib/eb";
import { persisted } from "svelte-persisted-store";
import { UserSettings } from "./lib/settings";
import { SvelteMap } from "svelte/reactivity";

// svelte-persisted-store doesn't export it for some reason
interface Persisted<T> extends Writable<T> {
  reset: () => void;
}

export let etebaseState = $state({
  etebaseAccount: null as (Etebase.Account | null),
  directoriesById: null as (SvelteMap<DirectoryID, Directory> | null),
  currentDirectory: null as (Directory | null),

  /** all pages and what directory they belong to */
  pagesIndex: new SvelteMap<PageID, Directory>(),

  /** all pages that have been loaded so far */
  cachedPages: new SvelteMap<PageID, Page>()
});

export const savedEtebaseSession: Persisted<string> = persisted(
  "saved-etebase-session",
  null
);

export const userSettings: Persisted<UserSettings> = persisted(
  "user-settings",
  new UserSettings()
);
