<script lang="ts">
  import { Directory } from "../lib/eb";
  import { currentDirectory } from "../stores";
  import { push } from "svelte-spa-router";
  export let directory: Directory;

  let nbPages = directory.collectionInfo.pages.length;

  let isCurrent: boolean;
  $: isCurrent = directory === $currentDirectory;

  function selectDirectory() {
    currentDirectory.set(directory);
    push("/");
  }
</script>

<button
  class={"directory-card " + (isCurrent ? "is-current" : "")}
  on:click={selectDirectory}
  disabled={isCurrent}
  class:isCurrent
>
  {#if isCurrent}<div class="current-marker">currently<br />viewing</div>{/if}
  <div class="inside">
    <div class="info">
      <h3>
        {directory.meta.name}
      </h3>
      {#if directory.meta.description}
        <em>{directory.meta.description}</em>
      {/if}
    </div>
    <div class="page-count">
      {nbPages === 0
        ? "No pages"
        : nbPages + " " + (nbPages === 1 ? "page" : "pages")}
    </div>
  </div>
</button>

<style>
  h3,
  p {
    margin: 0;
  }

  .directory-card {
    all: unset;
    display: flex;
    text-align: left;
    border: solid 1px;
    margin-bottom: 5px;
    overflow-x: clip;
  }
  .directory-card:hover {
    border-color: var(--primary);
    cursor: pointer;
  }
  .isCurrent:hover {
    cursor: default;
  }

  .inside {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    min-width: 50px;
    flex-grow: 1;
  }

  .info {
    flex: 1 1;
    overflow-x: auto;
    text-wrap: nowrap;
    min-width: 50px;
    align-items: center;
  }

  .page-count {
    margin: 0 15px;
    display: flex;
    align-items: center;
    margin-right: 0;
  }

  .is-current {
    border-color: var(--primary);
  }
  .current-marker {
    background-color: var(--primary);
    color: var(--bg);
    font-family: var(--ui-font);
    font-weight: bold;
    font-size: var(--ui-font-size);
    text-align: center;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .select-button {
    width: 100px;
  }
</style>
