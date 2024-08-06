import ListPages from "./routes/ListPages.svelte";
import NotFound from "./routes/NotFound.svelte";
import Settings from "./routes/Settings.svelte";
import CreateDirectory from "./routes/CreateDirectory.svelte";
import CreatePage from "./routes/CreatePage.svelte";
import Page from "./routes/Page.svelte";

export default {
  "/create-directory": CreateDirectory,
  "/create-page": CreatePage,
  "/page/:uid": Page,
  "/settings": Settings,
  "/": ListPages,
  // The catch-all route must always be last
  "*": NotFound,
};
