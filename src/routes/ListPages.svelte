<script lang="ts">
  import * as Etebase from "etebase";
  import {
    currentDirectory,
    directoriesById,
    etebaseAccount,
    userSettings,
  } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory, Page } from "../lib/eb";
  import PageCard from "../components/PageCard.svelte";
  import { onMount } from "svelte";

  let account: Etebase.Account;
  let dirs: Map<string, Directory>;
  let currentDir: Directory;
  let recentPages: string[] = [];
  let pages: Map<string, Page> | null = null;

  const unsubscribeFromAccount = etebaseAccount.subscribe(
    (acc) => (account = acc)
  );
  onDestroy(unsubscribeFromAccount);
  const unsubscribeFromDirectories = directoriesById.subscribe(
    (d) => (dirs = d)
  );
  onDestroy(unsubscribeFromDirectories);
  const unsubscribeFromCurrentDirectory = currentDirectory.subscribe(
    async (d) => {
      currentDir = d;
      pages = null;
      await currentDir.update();
      if (!currentDir.populated) {
        await currentDir.populate();
      }
      pages = currentDir.pages;
    }
  );
  onDestroy(unsubscribeFromCurrentDirectory);
  const unsubscribeFromUserSettings = userSettings.subscribe((us) => {
    let z = us.latestPageViewsByDirectory[currentDir.collection.uid];
    if (z) recentPages = z;
  });
  onDestroy(unsubscribeFromUserSettings);

  onMount(async () => {
    await currentDir.update();
    if (!currentDir.populated) {
      await currentDir.populate();
    }
    pages = currentDir.pages;
  });
</script>

{#if dirs.size == 0}No directories; <a href="#/create-directory"
    ><button>create one</button></a
  >
{:else}
  <h1>Pages in {currentDir.collection.getMeta().name}</h1>
  <div style="text-align: left;">
    {#if !pages}
      <p>Populating..</p>
    {:else if pages.size === 0}
      <p>No pages; <a href="#/create-page"><button>create one</button></a></p>
    {:else}
      {#if recentPages.length > 0}
        <div class="title-with-button">
          <h2>Recently viewed pages</h2>
          <a href="#/create-page"><button>New Page</button></a>
        </div>
        {#each recentPages.reverse() as pageId}
          <PageCard page={currentDir.pages.get(pageId)} />
        {/each}
        <div class="title-with-button">
          <h2>All pages</h2>
          <a href="#/create-page"><button>New Page</button></a>
        </div>
      {/if}
      {#each [...pages] as [_, page]}
        <PageCard {page} />
      {/each}
    {/if}
  </div>
  <a href="#/create-page"><button>New Page</button></a>
{/if}

<style>
  .title-with-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
