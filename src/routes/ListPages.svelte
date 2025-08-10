<script lang="ts">
  import { etebaseState, userSettings } from "../state.svelte";
  import { Page } from "../lib/eb";
  import PageCard from "../components/PageCard.svelte";

  let recentPages: string[] = $derived.by(() => {
    return $userSettings.latestPageViewsByDirectory[
      etebaseState.currentDirectory?.collection?.uid
    ]
      ? $userSettings.latestPageViewsByDirectory[
          etebaseState.currentDirectory?.collection?.uid
        ]
          .slice(-6)
          .reverse()
      : [];
  });

  // https://github.com/sveltejs/svelte/issues/9520
  let pagesPromise = $derived.by(async () => {
    if (!etebaseState.currentDirectory) return new Map<string, Page>();
    await etebaseState.currentDirectory.update();
    await etebaseState.currentDirectory.populate();
    return etebaseState.currentDirectory.pages;
  });
</script>

<svelte:head>
  <title
    >{etebaseState.currentDirectory
      ? etebaseState.currentDirectory.meta.name
      : "Etepedia"}</title
  >
</svelte:head>

{#if etebaseState.directoriesById.size == 0}No directories; <a
    href="#/create-directory"><button>create one</button></a
  >
{:else}
  <h1>Pages in {etebaseState.currentDirectory.meta.name}</h1>
  <div style="text-align: left;">
    {#await pagesPromise}
      <p>Populating..</p>
    {:then pages}
      {#if !pages}
        <p>Something went wrong fetching pages.</p>
      {:else if pages.size === 0}
        <p>No pages; <a href="#/create-page"><button>create one</button></a></p>
      {:else}
        {#if recentPages.length > 0}
          <div class="title-with-button">
            <h2>Recently viewed pages</h2>
            <a href="#/create-page"><button>New Page</button></a>
          </div>
          {#each recentPages as pageId}
            <PageCard page={pages.get(pageId)} />
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
    {:catch error}
      <p>Something went wrong fetching pages.</p>
    {/await}
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
