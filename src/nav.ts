import { push } from "svelte-spa-router";
import {
  currentDirectory,
  directoriesById,
  etebaseAccount,
  pagesById,
  savedEtebaseSession,
  userSettings,
} from "./stores";
import { get } from "svelte/store";
import { indexPages, listDirectories } from "./lib/eb";
import * as Etebase from "etebase";
import { UserSettings } from "./lib/settings";
import { toast } from "@zerodevx/svelte-toast";
import { mergeDeep as deeplyMerge } from "./lib/util";

export async function loadSession(ebAccount: Etebase.Account) {
  console.info("Successfully connected!");

  let dirs = await listDirectories(ebAccount);
  directoriesById.set(dirs);

  let uSettings: UserSettings;
  const unsubscribeFromUserSettings = userSettings.subscribe(
    (us) => (uSettings = us)
  );

  if (dirs.size > 0) {
    let userSelectedDir = uSettings.currentDirectory;
    if (userSelectedDir) {
      try {
        currentDirectory.set(dirs.get(userSelectedDir));
      } catch (error) {
        console.error(error);
        userSettings.update((us) => {
          delete us.currentDirectory;
          return us;
        });
        currentDirectory.set(dirs.values().next().value);
      }
    } else {
      currentDirectory.set(dirs.values().next().value);
    }
  }
  let gpi = await indexPages(Array.from(dirs.values())); // shouldn't be needed anymore in future versions where map works on iterators
  pagesById.set(gpi);

  unsubscribeFromUserSettings();
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
  directoriesById.set(null);
  currentDirectory.set(null);
  pagesById.set(new Map());
  push("/");
}

/* this is a workaround for these options not working in CSS */

export function pushToast(message: string, options: object = {}) {
  const defaultOptions = {
    theme: {
      "font-family": "Cantarell, sans-serif",
      "--toastBarBackground": "var(--primary)",
      "--toastBackground": "var(--gray)",
      "--toastColor": "var(--fg)",
    },
  };
  return toast.push(message, deeplyMerge(defaultOptions, options));
}

export function pushErrorToast(message: string, options: object = {}) {
  return pushToast(
    message,
    deeplyMerge({ theme: { "--toastBarBackground": "var(--red)" } }, options)
  );
}
export function pushSuccessToast(message: string, options: object = {}) {
  return pushToast(
    message,
    deeplyMerge({ theme: { "--toastBarBackground": "var(--green)" } }, options)
  );
}
