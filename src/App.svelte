<script lang="ts">
  import Router from "svelte-spa-router";
  import TopBar from "./components/TopBar.svelte";
  import routes from "./routes";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { pushToast, restoreSavedSession } from "./nav";
  import { onMount } from "svelte";
  import Login from "./components/Login.svelte";
  import { etebaseState, userSettings } from "./state.svelte";
  import DirSidebar from "./components/DirSidebar.svelte";
  import SearchSidebar from "./components/SearchSidebar.svelte";

  let leftSidebarOpen: boolean = $state(false);
  let rightSidebarOpen: boolean = $state(false);

  $effect(() => {
    if (
      etebaseState?.currentDirectory?.collection?.uid &&
      etebaseState.currentDirectory.collection.uid !=
        $userSettings.currentDirectory
    ) {
      $userSettings.currentDirectory =
        etebaseState.currentDirectory.collection.uid;
      pushToast(
        `Now viewing directory <b>${etebaseState.currentDirectory.meta.name}</b>`,
      );
    }
  });

  $effect(() => {
    if (etebaseState?.directoriesById) {
      if (!$userSettings?.directories) {
        $userSettings.directories = [];
      }
      etebaseState.directoriesById.forEach((_, id) => {
        if (!$userSettings.directories.includes(id)) {
          $userSettings.directories.push(id);
        }
      });
    }
  });

  onMount(async () => {
    if (etebaseState.etebaseAccount === null) await restoreSavedSession();
  });
</script>

<div
  class={"container colors"}
  style:color-scheme={$userSettings.preferredDeviceTheme ?? "light dark"}
>
  {#if etebaseState.etebaseAccount != null}
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
    height: 100%;
  }
</style>
