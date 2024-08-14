<script lang="ts">
  import { Directory } from "../lib/eb";
  import { currentDirectory } from "../stores";
  import { push } from "svelte-spa-router";
  import DirectoryCardInside from "./DirectoryCardInside.svelte";
  export let directory: Directory;

  export let inert: boolean;

  $: isCurrent = directory === $currentDirectory;

  function selectDirectory() {
    currentDirectory.set(directory);
    push("/");
  }
</script>

{#if inert}
  <div class="directory-card" class:isCurrent>
    <DirectoryCardInside {directory} />
  </div>
{:else}
  <button
    class="directory-card"
    class:isCurrent
    class:is-current-hover={isCurrent}
    class:directory-card-hover={!isCurrent}
    on:click={selectDirectory}
    disabled={isCurrent}
  >
    <DirectoryCardInside {directory} />
  </button>
{/if}

<style>
  .directory-card {
    all: unset;
    display: flex;
    text-align: left;
    border: solid 1px;
    margin-top: 2px;
    margin-bottom: 2px;
    margin-right: 1px;
    overflow-x: clip;
  }
  .directory-card-hover:hover {
    border-color: var(--primary);
    box-shadow: 0 0 3px var(--primary);
    cursor: pointer;
  }
  .is-current-hover:hover {
    cursor: default;
    box-shadow: none;
    border-color: var(--fg);
  }

  .isCurrent {
    border-width: 2px 2px 2px 2px;
    /* reduce margins to compensate for border width being 1px heavier */
    margin-top: 1px;
    margin-right: 0;
    margin-bottom: 1px;
  }
</style>
