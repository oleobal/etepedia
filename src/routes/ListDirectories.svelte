<script lang="ts">
  import { directoriesById } from "../stores";
  import { onDestroy } from "svelte";
  import { Directory } from "../lib/eb";
  import DirectoryCard from "../components/DirectoryCard.svelte";

  let dirs: Map<string, Directory>;
  const unsubscribeFromDirectories = directoriesById.subscribe(
    (d) => (dirs = d)
  );
  onDestroy(unsubscribeFromDirectories);
</script>

{#if dirs.size == 0}No directories; <a href="/#/create-directory">create one</a>
{:else}
  <h1>Index of directories</h1>

  {#each dirs.values() as directory}
    <DirectoryCard {directory} />
  {/each}
  <a href="/#/create-directory"><button>New directory</button></a>
{/if}
