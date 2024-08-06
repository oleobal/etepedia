<script lang="ts">
  import { directoriesById, etebaseAccount } from "../stores";
  import DirectoryCard from "./DirectoryCard.svelte";

  export let sidebarOpen = false;
</script>

<aside class:sidebarOpen>
  <nav>
    {#if $directoriesById.size == 0}No directories; <a href="#/create-directory"
        >create one</a
      >
    {:else}
      <h1 style="font-size: 19px;">Select a directory</h1>

      <div class="dir-list">
        {#each $directoriesById.values() as directory}
          <DirectoryCard {directory} />
        {/each}
      </div>
      <a href="#/create-directory"><button>New directory</button></a>
    {/if}
    <div style="flex-grow: 1"></div>
    <div style="font-family: var(--accent-font)">
      Logged in as <b>{$etebaseAccount.user.username}</b>.
      <a
        href="#/settings"
        on:click={() => {
          sidebarOpen = false;
        }}>Settings</a
      >
    </div>
  </nav>
</aside>

<style>
  nav {
    all: unset; /* weird default style rules on nav */
    width: 100%;
    display: flex;
    flex-direction: column;

    justify-content: space-between;

    align-items: center;
    height: calc(100% - 50px) /* kludge to compensate for the top bar */;
  }

  .dir-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
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

    border-right: solid 1px;
    border-bottom: solid 1px;
    border-color: var(--fg);
    background-color: var(--bg);

    left: calc(-100% - 1px);
    transition: left 0.2s ease-in-out;
  }

  .sidebarOpen {
    left: 0;
    box-shadow: -10px 0 40px var(--fg);
    clip-path: rect(
      0 0 100% 150%
    ); /* clip the shadow that would otherwise be on the top bar */
  }
</style>
