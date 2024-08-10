<script lang="ts">
  import { currentDirectory, directoriesById } from "../stores";
  import { onMount } from "svelte";
  import { Page } from "../lib/eb";
  import PageCard from "./PageCard.svelte";

  export let sidebarOpen = false;

  function normalize(s: string): string {
    return s.normalize().toLowerCase();
  }

  async function search(
    query: string,
    pages: Iterable<Page>,
    searchDeep: boolean
  ): Promise<Page[]> {
    query = normalize(query);
    let resultsByTier: Page[][] = [[], [], []];
    let totalResults = 0;
    for (const page of pages) {
      if (normalize(page.meta.name).includes(query)) {
        resultsByTier[0].push(page);
      } else if (normalize(page.meta.description).includes(query)) {
        resultsByTier[1].push(page);
      } else if (searchDeep) {
        if (!page.populated) {
          await page.populate();
        }
        if (normalize(page.content.text).includes(query)) {
          resultsByTier[2].push(page);
        }
      }
      if (totalResults > 100) break;
    }

    return resultsByTier.flat();
  }

  async function handleSearch() {
    let query = searchQuery.trim();
    if (query.length < 3) {
      results = null;
    } else {
      results = await search(query, pagesToSearch, !searchMetaOnly);
    }
  }

  async function adjustPagesToSearch() {
    if (searchAllDirs) {
      const dirs = Array.from($directoriesById.values());
      await Promise.all(
        dirs.map(async (dir) => {
          if (!dir.populated) {
            await dir.populate();
          }
        })
      );

      pagesToSearch = dirs.flatMap((dir) => Array.from(dir.pages.values()));
    } else {
      if ($currentDirectory !== null) {
        if (!$currentDirectory.populated) await $currentDirectory.populate();
        pagesToSearch = Array.from($currentDirectory.pages.values());
      } else {
        pagesToSearch = [];
      }
    }
  }

  onMount(adjustPagesToSearch);

  let searchQuery: string = "";
  $: searchQuery, handleSearch();

  let pagesToSearch: Page[];
  let searchMetaOnly: boolean = true;
  let searchAllDirs: boolean = false;
  let results: Page[] | null = null;
</script>

<aside class:sidebarOpen>
  <div class="inside">
    <div class="top">
      <h1 style="font-size: 19px;">Search</h1>
      <div class="settings">
        <div>
          <input
            type="checkbox"
            id="titles-only"
            bind:checked={searchMetaOnly}
            on:change={() => {
              handleSearch();
            }}
          />
          <label for="titles-only">Titles & descriptions only</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="all-directories"
            bind:checked={searchAllDirs}
            on:change={async () => {
              await adjustPagesToSearch();
              handleSearch();
            }}
          />
          <label for="all-directories">All directories</label>
        </div>
      </div>
      <input
        type="search"
        bind:value={searchQuery}
        placeholder="Search"
        style="width: 100%; font-size: 16px; margin: 5px 0;"
      />
    </div>
    <div class="results">
      {#if results !== null && results.length > 0}
        {#each results as result}
          <PageCard page={result} />
        {/each}
      {:else}
        <div
          style="display: flex; align-items: center; flex-direction: column; justify-content: space-evenly; flex-grow: 1;"
        >
          {#if results === null}
            <em>Enter your query above</em>
          {:else}
            <em>No results</em>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</aside>

<style>
  .settings {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .top {
    display: flex;
    flex-direction: column;

    align-items: stretch;
  }
  .results {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
  }

  .inside {
    display: flex;
    flex-direction: column;

    align-items: stretch;
    height: calc(100% - 50px) /* kludge to compensate for the top bar */;
  }

  aside {
    position: fixed;
    max-width: calc(
      100% + 1px
    ); /* because of box-sizing: border-box and not wanting to see the border in full-screen */
    width: 500px;
    top: 42px;
    height: 100%;
    padding: 0 5px;
    box-sizing: border-box;

    border-left: solid 1px;
    border-bottom: solid 1px;
    border-color: var(--fg);
    background-color: var(--bg);

    right: calc(-100% - 1px);
    transition: right 0.2s ease-in-out;
  }

  .sidebarOpen {
    right: 0;
    box-shadow: 10px 0 40px var(--fg);
    clip-path: rect(
      0 -50% 100% 100%
    ); /* clip the shadow that would otherwise be on the top bar */
  }
</style>
