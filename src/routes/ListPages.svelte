<script lang="ts">
  import { currentDirectory, directoriesById, userSettings } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory, Page } from "../lib/eb";
  import PageCard from "../components/PageCard.svelte";
  import { onMount } from "svelte";

  let currentDir: Directory;

  let recentPages: string[];

  $: recentPages = $userSettings.latestPageViewsByDirectory[
    currentDir.collection.uid
  ]
    ? $userSettings.latestPageViewsByDirectory[currentDir.collection.uid]
        .slice(-6)
        .reverse()
    : [];

  let pages: Map<string, Page> | null = null;

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

  onMount(async () => {
    await currentDir.update();
    if (!currentDir.populated) {
      await currentDir.populate();
    }
    pages = currentDir.pages;
  });
</script>

<svelte:head>
  <title>{$currentDirectory.meta.name}</title>
</svelte:head>

{#if $directoriesById.size == 0}No directories; <a href="#/create-directory"
    ><button>create one</button></a
  >
{:else}
  <h1>Pages in {currentDir.meta.name}</h1>
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
        {#each recentPages as pageId}
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
