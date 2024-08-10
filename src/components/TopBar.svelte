<script lang="ts">
  import closeCrossIconUrl from "../../static/close-cross.svg";
  import listIconUrl from "../../static/list.svg";
  import magnifyingGlassIconUrl from "../../static/magnifying-glass.svg";

  import { currentDirectory } from "../stores";

  export let leftSidebarOpen = false;
  export let rightSidebarOpen = false;
  let anySideBarOpen: boolean;
  $: anySideBarOpen = leftSidebarOpen || rightSidebarOpen;
</script>

<div class="topbar" class:anySideBarOpen>
  <button
    style="height: 42px; width: 42px; margin-right: 5px; font-size: 150%; padding: 0; flex-shrink: 0;"
    on:click={() => (leftSidebarOpen = !leftSidebarOpen)}
    >{#if leftSidebarOpen}
      <img src={closeCrossIconUrl} alt="close list of directories" />
    {:else}
      <img src={listIconUrl} alt="open list of directories" />
    {/if}
  </button>
  <div class="restofbar">
    <div style="text-wrap: nowrap; overflow-x: clip;">
      {#if $currentDirectory != null}
        <a
          href="#/"
          on:click={() => {
            leftSidebarOpen = false;
          }}>{$currentDirectory.meta.name}</a
        >
      {:else}
        (no directory selected)
      {/if}
    </div>
    <div style="flex-grow: 1;"></div>
  </div>
  <button
    style="height: 42px; width: 42px; margin-left: 5px; font-size: 150%; padding: 0; flex-shrink: 0;"
    on:click={() => (rightSidebarOpen = !rightSidebarOpen)}
    >{#if rightSidebarOpen}
      <img src={closeCrossIconUrl} alt="close search menu" />
    {:else}
      <img src={magnifyingGlassIconUrl} alt="open search menu" />
    {/if}</button
  >
</div>
<div
  class="filler-when-fixed"
  style={"display:" + (anySideBarOpen ? "block" : "none")}
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
    min-width: 0px;
    padding: 5px;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow-x: auto;
  }

  .filler-when-fixed {
    height: 42px;
  }

  .anySideBarOpen {
    position: fixed;
    width: 100%;

    box-shadow: 0 -10px 40px var(--fg);
    transition: box-shadow 0.2s ease-in-out;
  }

  a {
    color: var(--fg);
  }
</style>
