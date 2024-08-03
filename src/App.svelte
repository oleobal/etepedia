<script>
  import Router from "svelte-spa-router";
  import TopBar from "./components/TopBar.svelte";
  import routes from "./routes";
  import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

<TopBar />
<main>
  <Router {routes} />
</main>
<SvelteToast />

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 1000px;
    margin: 0 auto;
  }
</style>
