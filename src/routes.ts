import Login from "./components/Login.svelte";
import ListPages from "./routes/ListPages.svelte";
import NotFound from "./routes/NotFound.svelte";
import Settings from "./routes/Settings.svelte";
import { wrap } from "svelte-spa-router/wrap";
import CreateDirectory from "./routes/CreateDirectory.svelte";
import CreatePage from "./routes/CreatePage.svelte";
import Page from "./routes/Page.svelte";

import ListDirectories from "./routes/ListDirectories.svelte";

export default {
  "/create-directory": CreateDirectory,
  "/directories/": ListDirectories,
  "/create-page": CreatePage,
  "/page/:uid": Page,
  "/settings": Settings,
  "/": ListPages,
  // The catch-all route must always be last
  "*": NotFound,
};
