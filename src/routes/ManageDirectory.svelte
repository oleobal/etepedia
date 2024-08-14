<script lang="ts">
  import { onDestroy } from "svelte";
  import { directoriesById, currentDirectory } from "../stores";
  import { Directory } from "../lib/eb";
  import { toast } from "@zerodevx/svelte-toast";
  import { pushErrorToast, pushSuccessToast } from "../nav";

  export let params: { uid: string } = { uid: "" };

  $: $currentDirectory = $directoriesById.get(params?.uid);

  let directory: Directory;
  let name;
  let description;
  const unsubscribeFromCurrentDirectory = currentDirectory.subscribe((dir) => {
    directory = dir;
    name = directory.meta.name;
    description = directory.meta.description;
  });
  onDestroy(unsubscribeFromCurrentDirectory);

  function cancelChanges() {
    name = directory.meta.name;
    description = directory.meta.description;
  }

  async function saveChanges() {
    directory.meta.name = name;
    directory.meta.description = description;
    try {
      await directory.saveMeta();
      pushSuccessToast("Changes saved");
    } catch (error) {
      pushErrorToast("Couldn't save changes");
      console.log(error);
    }
  }
</script>

<svelte:head>
  <title>Manage {$currentDirectory.meta.name}</title>
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
  <h1>Manage directory {$currentDirectory.meta.name}</h1>
  <input
    style="width: 100%; box-sizing: border-box"
    placeholder="Name"
    bind:value={name}
  />
  <textarea
    style="width: 100%; box-sizing: border-box"
    placeholder="Description"
    bind:value={description}
  />
  <div class="buttons">
    <button
      disabled={name === directory.meta.name &&
        description === directory.meta.description}
      on:click={cancelChanges}
      class="red-button">Cancel changes</button
    >
    <button
      disabled={name === directory.meta.name &&
        description === directory.meta.description}
      on:click={saveChanges}
      class="green-button">Save changes</button
    >
  </div>
</div>

<style>
  .buttons {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
</style>
