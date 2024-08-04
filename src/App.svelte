<script lang="ts">
  import Router, { push } from "svelte-spa-router";
  import TopBar from "./components/TopBar.svelte";
  import routes from "./routes";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { restoreSavedSession } from "./nav";
  import { onDestroy, onMount } from "svelte";
  import Login from "./components/Login.svelte";
  import { etebaseAccount } from "./stores";

  let ebAccount;
  const unsubscribe = etebaseAccount.subscribe((val) => {
    ebAccount = val;
  });
  onDestroy(unsubscribe);

  onMount(async () => {
    if (ebAccount === null) await restoreSavedSession();
  });
</script>

{#if ebAccount != null}
  <TopBar />
  <main>
    <Router {routes} />
  </main>
  <SvelteToast />
{:else}
  <Login />
{/if}

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 1000px;
    margin: 0 auto;
  }
</style>
