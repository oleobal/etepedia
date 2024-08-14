<script lang="ts">
  import Router from "svelte-spa-router";
  import TopBar from "./components/TopBar.svelte";
  import routes from "./routes";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { pushToast, restoreSavedSession } from "./nav";
  import { onDestroy, onMount } from "svelte";
  import Login from "./components/Login.svelte";
  import {
    etebaseAccount,
    userSettings,
    currentDirectory,
    directoriesById,
  } from "./stores";
  import DirSidebar from "./components/DirSidebar.svelte";
  import SearchSidebar from "./components/SearchSidebar.svelte";

  let leftSidebarOpen: boolean = false;
  let rightSidebarOpen: boolean = false;
  let darkMode = false;

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
        pushToast(`Now viewing directory <b>${currentDir.meta.name}</b>`);
      }
    }
  );
  onDestroy(unsubscribeFromCurrentDirectory);

  const unsubscribeFromDirectories = directoriesById.subscribe((dirs) => {
    if (!dirs) return;
    dirs.forEach((_, id) => {
      if (!$userSettings.directories.includes(id)) {
        $userSettings.directories.push(id);
      }
    });
  });
  onDestroy(unsubscribeFromDirectories);

  onMount(async () => {
    if (ebAccount === null) await restoreSavedSession();
  });
</script>

<div class={"container light-colors " + (darkMode ? "dark-colors" : "")}>
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
</div>

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

  .container {
    background-color: var(--bg);
    color: var(--fg);
    border-color: var(--fg);
  }
</style>
