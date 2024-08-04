import { push } from "svelte-spa-router";
import {
  currentDirectory,
  directories,
  etebaseAccount,
  globalPageIndex,
  savedEtebaseSession,
} from "./stores";
import { get } from "svelte/store";
import { indexPages, listDirectories } from "./lib/eb";
import * as Etebase from "etebase";

export async function loadSession(ebAccount: Etebase.Account) {
  console.info("Successfully connected!");

  let dirs = await listDirectories(ebAccount);
  directories.set(dirs);
  if (dirs.length > 0) {
    currentDirectory.set(dirs[0]);
  }
  let gpi = await indexPages(dirs);
  globalPageIndex.set(gpi);
  etebaseAccount.set(ebAccount); // last because this will trigger updates
}

export async function restoreSavedSession() {
  let savedSession: string | null = get(savedEtebaseSession);
  if (savedSession) {
    console.info("Restoring saved session");
    try {
      const ebAccount = await Etebase.Account.restore(savedSession);
      await loadSession(ebAccount);
    } catch (error) {
      console.error("Couldn't restore saved session", error);
      savedEtebaseSession.reset();
    }
  } else {
    console.info("No previous session");
  }
}

export function logout() {
  etebaseAccount.set(null);
  savedEtebaseSession.reset();
  directories.set(null);
  currentDirectory.set(null);
  globalPageIndex.set(new Map());
  push("/");
}
