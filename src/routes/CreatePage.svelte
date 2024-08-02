<script lang="ts">
  import { currentDirectory } from "../stores";
  import { Directory, Page } from "../lib/eb";
  import { replace } from "svelte-spa-router";
  import { onDestroy } from "svelte";

  let currentDir: Directory;

  const unsubscribe = currentDirectory.subscribe(
    (newVal) => (currentDir = newVal)
  );
  onDestroy(unsubscribe);

  let name: string;
  let description: string;
  let text: string;

  async function handleCreation() {
    let page = new Page();
    page.meta.name = name;
    page.meta.description = description;
    page.content.article = text;

    await currentDir.uploadPage(page);
    replace(`/page/${page.item.uid}`);
  }
</script>

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
  <h1>Create page on {currentDir.collection.getMeta().name}</h1>
  <input style="width: 100%" placeholder="Name" bind:value={name} />
  <textarea
    style="width: 100%"
    placeholder="Description"
    bind:value={description}
  />
  <textarea style="width: 100%" placeholder="Text" bind:value={text} />
  <button on:click={handleCreation}>Create</button>
</div>
