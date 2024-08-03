<script lang="ts">
  import * as Etebase from "etebase";
  import { currentDirectory, directories, etebaseAccount } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory } from "../lib/eb";

  let account: Etebase.Account;
  let dirs: Directory[];
  let currentDir: Directory;
  const unsubscribeFromAccount = etebaseAccount.subscribe(
    (acc) => (account = acc)
  );
  const unsubscribeFromDirectories = directories.subscribe((d) => (dirs = d));
  const unsubscribeFromCurrentDirectory = currentDirectory.subscribe(
    async (d) => {
      currentDir = d;
    }
  );

  onDestroy(unsubscribeFromAccount);
  onDestroy(unsubscribeFromDirectories);
  onDestroy(unsubscribeFromCurrentDirectory);
</script>

{#if account != null}
  <div class="topbar">
    <div>
      <a href="/#/directories"><button style="width: 2.3em">#</button></a>
      {#if currentDir != null}
        <a href="/#/">{currentDir.collection.getMeta().name}</a>
      {:else}
        (no directory selected)
      {/if}
    </div>
    <div>
      <input placeholder="Search" />
    </div>
    <div><a href="/#/settings">{account.user.username}</a></div>
  </div>
{/if}

<style lang="css">
  .topbar {
    align-items: center;
    border-bottom: 1px solid;
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 5px;
  }

  a {
    color: var(--fg);
  }
</style>
