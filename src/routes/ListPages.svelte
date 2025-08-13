<script lang="ts">
  import { etebaseState, userSettings } from "../state.svelte";
  import PageCard from "../components/PageCard.svelte";
    import { onMount } from "svelte";

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

  onMount(async () => {
    await etebaseState.currentDirectory.update();
    await etebaseState.currentDirectory.populate();
  })
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
    {#if (!etebaseState.currentDirectory.pages)}
      <p>Populating..</p>
    {:else}
      {#if etebaseState.currentDirectory.pages.size === 0}
        <p>No pages; <a href="#/create-page"><button>create one</button></a></p>
      {:else}
        {#if recentPages.length > 0}
          <div class="title-with-button">
            <h2>Recently viewed pages</h2>
            <a href="#/create-page"><button>New Page</button></a>
          </div>
          {#each recentPages as pageId}
            <PageCard page={etebaseState.currentDirectory.pages.get(pageId)} />
          {/each}
          <div class="title-with-button">
            <h2>All pages</h2>
            <a href="#/create-page"><button>New Page</button></a>
          </div>
        {/if}
        {#each [...etebaseState.currentDirectory.pages] as [_, page]}
          <PageCard {page} />
        {/each}
      {/if}
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
