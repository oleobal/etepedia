import Login from "./routes/Login.svelte";
import Index from "./routes/Index.svelte";
import NotFound from "./routes/NotFound.svelte";
import { wrap } from "svelte-spa-router/wrap";
import { replace } from "svelte-spa-router";
import { etebaseAccount } from "./stores";
import { get } from "svelte/store";
import CreateDirectory from "./routes/CreateDirectory.svelte";
import CreatePage from "./routes/CreatePage.svelte";
import Page from "./routes/Page.svelte";

function isLoggedIn(): boolean {
  if (get(etebaseAccount) === null) {
    replace("/login");
    return false;
  }
  return true;
}

export default {
  "/login": Login,
  "/create-directory": wrap({
    component: CreateDirectory,
    conditions: [isLoggedIn],
  }),
  "/create-page": wrap({
    component: CreatePage,
    conditions: [isLoggedIn],
  }),
  "/page/:uid": wrap({
    component: Page,
    conditions: [isLoggedIn],
  }),
  "/": wrap({
    component: Index,
    conditions: [isLoggedIn],
  }),
  // The catch-all route must always be last
  "*": NotFound,
};
