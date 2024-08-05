<script lang="ts">
  import { directoriesById, etebaseAccount } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory } from "../lib/eb";
  import DirectoryCard from "../components/DirectoryCard.svelte";
  import * as Etebase from "etebase";

  export let sidebarOpen = false;

  let account: Etebase.Account;
  const unsubscribeFromAccount = etebaseAccount.subscribe(
    (acc) => (account = acc)
  );
  onDestroy(unsubscribeFromAccount);

  let dirs: Map<string, Directory>;
  const unsubscribeFromDirectories = directoriesById.subscribe(
    (d) => (dirs = d)
  );
  onDestroy(unsubscribeFromDirectories);
</script>

<aside class:sidebarOpen>
  <nav>
    {#if dirs.size == 0}No directories; <a href="#/create-directory"
        >create one</a
      >
    {:else}
      <h1>Select a directory</h1>

      <div class="dir-list">
        {#each dirs.values() as directory}
          <DirectoryCard {directory} />
        {/each}
      </div>
      <a href="#/create-directory"><button>New directory</button></a>
    {/if}
    <div style="flex-grow: 1"></div>
    <div style="font-family: var(--accent-font)">
      Logged in as <b>{account.user.username}</b>.
      <a href="#/settings">Settings</a>
    </div>
  </nav>
</aside>

<style>
  nav {
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
