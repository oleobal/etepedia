<script lang="ts">
  import { etebaseState } from "../state.svelte";
  import { Directory } from "../lib/eb.svelte";
  import { pushErrorToast, pushSuccessToast } from "../nav";

  let { uid }: { uid: string } = $props();

  let directory: Directory = $state();
  let name: string | null = $state();
  let description: string | null = $state();

  $effect(() => {
    etebaseState.currentDirectory = etebaseState.directoriesById.get(uid);
    directory = etebaseState.directoriesById.get(uid);
    name = directory.meta.name;
    description = directory.meta.description;
  });

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
  <title>Manage {directory.meta.name}</title>
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
  <h1>Manage directory {directory.meta.name}</h1>
  <input
    style="width: 100%; box-sizing: border-box"
    placeholder="Name"
    bind:value={name}
  />
  <textarea
    style="width: 100%; box-sizing: border-box"
    placeholder="Description"
    bind:value={description}
  ></textarea>
  <div class="buttons">
    <button
      disabled={name === directory.meta.name &&
        description === directory.meta.description}
      onclick={cancelChanges}
      class="red-button">Cancel changes</button
    >
    <button
      disabled={name === directory.meta.name &&
        description === directory.meta.description}
      onclick={saveChanges}
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
