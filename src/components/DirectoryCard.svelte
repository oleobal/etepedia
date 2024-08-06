<script lang="ts">
  import { Directory } from "../lib/eb";
  import { currentDirectory } from "../stores";
  import { toast } from "@zerodevx/svelte-toast";
  import { push } from "svelte-spa-router";
  export let directory: Directory;

  let nbPages = directory.collectionInfo.pages.length;

  let isCurrent: boolean;
  $: isCurrent = directory === $currentDirectory;

  let meta = directory.collection.getMeta();

  function selectDirectory() {
    currentDirectory.set(directory);
    push("/");
    toast.push(
      "Now viewing directory <b>" + directory.collection.getMeta().name + "</b>"
    );
  }
</script>

<button
  class={"directory-card " + (isCurrent ? "is-current" : "")}
  on:click={selectDirectory}
  disabled={isCurrent}
  class:isCurrent
>
  {#if isCurrent}<div class="current-marker">Currently<br />viewing</div>{/if}
  <div class="inside">
    <div
      style="flex: 1 1; overflow-x: auto; text-wrap: nowrap; min-width: 50px;"
    >
      <h3>
        {meta.name}
      </h3>
      <p>
        <em>{meta.description}</em>
      </p>
    </div>
    <div
      style="margin: 0 15px; display:flex; align-items: center; margin-right: 0;"
    >
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

  .is-current {
    border-color: var(--primary);
  }
  .current-marker {
    background-color: var(--primary);
    color: var(--bg);
    font-family: var(--accent-font);
    font-weight: bold;
    font-size: 90%;
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
