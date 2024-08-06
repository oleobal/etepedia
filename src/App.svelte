<script lang="ts">
  import Router from "svelte-spa-router";
  import TopBar from "./components/TopBar.svelte";
  import routes from "./routes";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { restoreSavedSession } from "./nav";
  import { onDestroy, onMount } from "svelte";
  import Login from "./components/Login.svelte";
  import { etebaseAccount, userSettings, currentDirectory } from "./stores";
  import DirSidebar from "./components/DirSidebar.svelte";
  import SearchSidebar from "./components/SearchSidebar.svelte";

  let leftSidebarOpen: boolean = false;
  let rightSidebarOpen: boolean = false;

  let ebAccount;
  const unsubscribeFromAccount = etebaseAccount.subscribe((val) => {
    ebAccount = val;
  });
  onDestroy(unsubscribeFromAccount);

  const unsubscribeFromCurrentDirectory = currentDirectory.subscribe(
    (currentDir) => {
      if (currentDir) {
        userSettings.update((userSetts) => {
          userSetts.currentDirectory = currentDir?.collection?.uid;
          return userSetts;
        });
      }
    }
  );
  onDestroy(unsubscribeFromCurrentDirectory);

  onMount(async () => {
    if (ebAccount === null) await restoreSavedSession();
  });
</script>

{#if ebAccount != null}
  <TopBar bind:leftSidebarOpen bind:rightSidebarOpen />
  <DirSidebar bind:sidebarOpen={leftSidebarOpen} />
  <SearchSidebar bind:sidebarOpen={rightSidebarOpen} />
  <main>
    <Router {routes} />
  </main>
{:else}
  <Login />
{/if}
<SvelteToast options={{ reversed: true }} />

<style>
  :root {
    --toastContainerTop: auto;
    --toastContainerRight: 20px;
    --toastContainerBottom: 20px;
    --toastContainerLeft: auto;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 1000px;
    margin: 0 auto;
  }
</style>
