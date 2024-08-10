<script lang="ts">
  import { etebaseAccount, directoriesById, currentDirectory } from "../stores";
  import { listDirectories, Directory } from "../lib/eb";
  import { replace } from "svelte-spa-router";
  import { get } from "svelte/store";

  let name: string;
  let description: string;
  let creating = false;

  let ebAccount = get(etebaseAccount);

  async function handleCreation() {
    creating = true;
    let newDir = await Directory.Create(ebAccount.getCollectionManager(), {
      name: name,
      description: description,
    });

    let dirs = await listDirectories(ebAccount);
    directoriesById.set(dirs);
    currentDirectory.set(newDir);
    creating = false;
    replace("/");
  }
</script>

<svelte:head>
  <title>Create directory</title>
</svelte:head>

<div
  style="
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    max-width: 300px;
    margin-right: auto;
    margin-left: auto;
    "
>
  <h1>Create a directory</h1>
  <input style="width: 100%" placeholder="Name" bind:value={name} />
  <textarea
    style="width: 100%"
    placeholder="Description"
    bind:value={description}
  />
  <button on:click={handleCreation} disabled={!name || creating}>Create</button>
</div>
