<script lang="ts">
  import * as Etebase from "etebase";
  import { currentDirectory, directories, etebaseAccount } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory } from "../lib/eb";
  import DirectoryCard from "../components/DirectoryCard.svelte";

  let account: Etebase.Account;
  let dirs: Directory[];
  let currentDir: Directory;

  const unsubscribeFromDirectories = directories.subscribe((d) => (dirs = d));
  const unsubscribeFromCurrentDirectory = currentDirectory.subscribe(
    async (d) => {
      currentDir = d;
    }
  );

  onDestroy(unsubscribeFromDirectories);
  onDestroy(unsubscribeFromCurrentDirectory);
</script>

{#if dirs.length == 0}No directories; <a href="/#/create-directory"
    >create one</a
  >
{:else}
  <h1>Index of directories</h1>

  {#each dirs as directory}
    <DirectoryCard {directory} />
  {/each}
  <a href="/#/create-directory"><button>New directory</button></a>
{/if}
