import { replace } from "svelte-spa-router";
import { etebaseAccount } from "./stores";
import { get } from "svelte/store";

export function isLoggedIn(): boolean {
  return get(etebaseAccount) !== null;
}

export function redirectIfNotLoggedIn(): boolean {
  const loggedIn = isLoggedIn();
  if (!loggedIn) {
    replace("/login");
  }
  return loggedIn;
}
