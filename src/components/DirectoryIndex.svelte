<script lang="ts">
  import { Directory, Page } from "../lib/eb";
  import PageCard from "./PageCard.svelte";
  import { onMount } from "svelte";

  export let directory: Directory;

  let pages: Map<string, Page> | null = null;

  onMount(async () => {
    await directory.update();
    if (!directory.populated) {
      await directory.populate();
    }
    pages = directory.pages;
  });
</script>

{#if !pages}
  <p>Populating..</p>
{:else}
  {#if pages.size === 0}
    <p>No pages</p>
  {/if}
  {#each [...pages] as [uid, page]}
    <a href={`/#/page/${uid}`}><PageCard {page} /></a>
  {/each}
{/if}
