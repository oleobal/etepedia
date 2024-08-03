<script lang="ts">
  import * as Etebase from "etebase";
  import { currentDirectory, directories, etebaseAccount } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory } from "../lib/eb";
  import DirectoryIndex from "../components/DirectoryIndex.svelte";

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

{#if dirs.length == 0}No directories; <a href="/#/create-directory"
    ><button>create one</button></a
  >
{:else}
  <h1>Pages in {currentDir.collection.getMeta().name}</h1>
  <DirectoryIndex directory={currentDir} />
{/if}
