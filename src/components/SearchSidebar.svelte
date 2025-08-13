<script lang="ts">
  import { etebaseState } from "../state.svelte";
  import { Page } from "../lib/eb.svelte";
  import PageCard from "./PageCard.svelte";

  let { sidebarOpen = $bindable() }: { sidebarOpen: boolean } = $props();

  /** normalize and lowercase strings */
  function normalize<T>(s: T): T {
    if (typeof s === "string") return s.normalize().toLowerCase() as T;
    return s;
  }

  async function search(
    query: string,
    pages: Iterable<Page>,
    searchDeep: boolean,
  ): Promise<Page[]> {
    query = normalize(query);
    let resultsByTier: Page[][] = [[], [], []];
    let totalResults = 0;
    for (const page of pages) {
      if (normalize(page.meta.name)?.includes(query)) {
        resultsByTier[0].push(page);
      } else if (normalize(page.meta.description)?.includes(query)) {
        resultsByTier[1].push(page);
      } else if (searchDeep) {
        if (!page.populated) {
          await page.populate();
        }
        if (normalize(page.content.text)?.includes(query)) {
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
      const dirs = Array.from(etebaseState.directoriesById.values());
      await Promise.all(
        dirs.map(async (dir) => {
          if (!dir.populated) {
            await dir.populate();
          }
        }),
      );

      pagesToSearch = dirs.flatMap((dir) => Array.from(dir.pages.values()));
    } else {
      if (etebaseState.currentDirectory) {
        if (!etebaseState.currentDirectory.populated)
          await etebaseState.currentDirectory.populate();
        pagesToSearch = Array.from(
          etebaseState.currentDirectory.pages.values(),
        );
      } else {
        pagesToSearch = [];
      }
    }
  }

  let searchQuery: string = $state("");
  $effect(() => {
    searchQuery;
    handleSearch();
  });
  $effect(() => {
    etebaseState.currentDirectory;
    adjustPagesToSearch();
  });
  $effect(() => {
    pagesToSearch;
    handleSearch();
  });

  let pagesToSearch: Page[] = $state([]);
  let searchMetaOnly: boolean = $state(true);
  let searchAllDirs: boolean = $state(false);
  let results: Page[] | null = $state(null);
</script>

<aside class:sidebarOpen>
  <div class="inside">
    <div class="top">
      <h1 style="font-size: 19px">Search</h1>
      <div class="settings">
        <div
          title="Only match results in titles and descriptions, as searching through all page text is very intensive."
        >
          <input
            type="checkbox"
            id="titles-only"
            bind:checked={searchMetaOnly}
            onchange={() => {
              handleSearch();
            }}
          />
          <label for="titles-only">Titles & descriptions only</label>
        </div>
        <div
          title={`Search through all accessible directories, not just the current one (${etebaseState?.currentDirectory?.meta?.name})`}
        >
          <input
            type="checkbox"
            id="all-directories"
            bind:checked={searchAllDirs}
            onchange={async () => {
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
          <em>
            {#if results === null}
              {#if searchQuery}
                Query too short, keep typing
              {:else}
                Enter your query above
              {/if}
            {:else}
              No results
            {/if}
          </em>
        </div>
      {/if}
    </div>
  </div>
</aside>

<style>
  .settings {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .top {
    display: flex;
    flex-direction: column;
    padding: 5px; /* padding here and not to the aside element so as not to clip box-shadows */

    align-items: center;
  }
  .results {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    overflow-y: auto;
    padding: 5px; /* padding here and not to the aside element so as not to clip box-shadows */
    box-sizing: border-box;
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
      0 100% 100% -50%
    ); /* clip the shadow that would otherwise be on the top bar */
  }
</style>
