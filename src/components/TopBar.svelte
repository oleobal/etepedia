<script lang="ts">
  import { currentDirectory } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory } from "../lib/eb";

  let currentDir: Directory;
  const unsubscribeFromCurrentDirectory = currentDirectory.subscribe(
    async (d) => {
      currentDir = d;
    }
  );
  onDestroy(unsubscribeFromCurrentDirectory);

  export let sidebarOpen = false;
</script>

<div class="topbar" class:sidebarOpen>
  <button
    style="height: 42px; width: 42px; margin-right: 5px;"
    on:click={() => (sidebarOpen = !sidebarOpen)}
    >{sidebarOpen ? "X" : "#"}</button
  >
  <div class="restofbar">
    <div style="text-wrap: nowrap; overflow-x: clip;">
      {#if currentDir != null}
        <a href="#/">{currentDir.collection.getMeta().name}</a>
      {:else}
        (no directory selected)
      {/if}
    </div>
    <div style="flex-grow: 1"></div>
    <input placeholder="Search" />
  </div>
</div>
<div
  class="filler-when-fixed"
  style={"display:" + (sidebarOpen ? "block" : "none")}
>
  <!-- this is to avoid page elements shifting when the top bar switches to fixed positioning -->
</div>

<style>
  .topbar {
    align-items: center;
    border-bottom: 1px solid;
    display: flex;
    justify-content: stretch;
    margin: 0;
    max-height: 42px;
    height: 42px;
    box-sizing: border-box;
    background-color: var(--bg);
  }

  .restofbar {
    padding: 5px;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .filler-when-fixed {
    height: 42px;
  }

  .sidebarOpen {
    position: fixed;
    width: 100%;

    box-shadow: 0 -10px 40px var(--fg);
    transition: box-shadow 0.2s ease-in-out;
  }

  a {
    color: var(--fg);
  }
</style>
