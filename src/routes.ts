import Login from "./routes/Login.svelte";
import ListPages from "./routes/ListPages.svelte";
import NotFound from "./routes/NotFound.svelte";
import Settings from "./routes/Settings.svelte";
import { wrap } from "svelte-spa-router/wrap";
import CreateDirectory from "./routes/CreateDirectory.svelte";
import CreatePage from "./routes/CreatePage.svelte";
import Page from "./routes/Page.svelte";

import { redirectIfNotLoggedIn } from "./nav";
import ListDirectories from "./routes/ListDirectories.svelte";

export default {
  "/login": Login,
  "/create-directory": wrap({
    component: CreateDirectory,
    conditions: [redirectIfNotLoggedIn],
  }),
  "/directories/": wrap({
    component: ListDirectories,
    conditions: [redirectIfNotLoggedIn],
  }),
  "/create-page": wrap({
    component: CreatePage,
    conditions: [redirectIfNotLoggedIn],
  }),
  "/page/:uid": wrap({
    component: Page,
    conditions: [redirectIfNotLoggedIn],
  }),
  "/settings": wrap({
    component: Settings,
    conditions: [redirectIfNotLoggedIn],
  }),
  "/": wrap({
    component: ListPages,
    conditions: [redirectIfNotLoggedIn],
  }),
  // The catch-all route must always be last
  "*": NotFound,
};
