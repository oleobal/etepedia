<script lang="ts">
  import { onDestroy } from "svelte";
  import { Directory } from "../lib/eb";
  import { currentDirectory } from "../stores";
  import { toast } from "@zerodevx/svelte-toast";
  export let directory: Directory;

  let nbPages = directory.collectionInfo.pages.length;

  let currentDir: Directory;
  let isCurrent: boolean;

  let unsubscribeFromCurrentDir = currentDirectory.subscribe((val) => {
    currentDir = val;
    isCurrent = directory === currentDir;
  });
  onDestroy(unsubscribeFromCurrentDir);

  let meta = directory.collection.getMeta();

  function selectDirectory() {
    currentDirectory.set(directory);
    toast.push("Now viewing directory " + directory.collection.getMeta().name);
  }
</script>

<div class={"directory-card " + (isCurrent ? "is-current" : "")}>
  <div>
    <h3>
      {meta.name}
    </h3>
    <p><em>{meta.description}</em></p>
  </div>

  <div style="flex-grow: 1"></div>
  <div style="margin: 0 15px; display:flex; align-items: center;">
    {nbPages === 0
      ? "No pages"
      : nbPages + " " + (nbPages === 1 ? "page" : "pages")}
  </div>
  <button class="select-button" on:click={selectDirectory} disabled={isCurrent}
    >{#if isCurrent}Currently viewing{:else}Select{/if}</button
  >
</div>

<style>
  h3,
  p {
    margin: 0;
  }

  .directory-card {
    text-align: left;
    padding: 10px;
    border: solid 1px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    margin-bottom: 5px;
  }

  .is-current {
    border-color: var(--primary);
  }

  .select-button {
    width: 100px;
  }
</style>
