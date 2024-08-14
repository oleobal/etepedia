<script lang="ts">
  import { Directory } from "../lib/eb";
  import { currentDirectory } from "../stores";
  export let directory: Directory;

  let nbPages = directory.collectionInfo.pages.length;

  $: isCurrent = directory === $currentDirectory;
</script>

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

<style>
  h3 {
    margin: 0;
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
  .current-marker {
    background-color: var(--fg);
    color: var(--bg);
    font-family: var(--ui-font);
    font-weight: bold;
    font-size: var(--ui-font-size);
    text-align: center;
    padding: 0 5px 0 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
