<script lang="ts">
  import { currentDirectory } from "../stores";
  import { Page } from "../lib/eb";
  import { parse } from "marked";
  import DOMPurify from "dompurify";
  import { pushToast, pushSuccessToast, pushErrorToast } from "../nav";
  import { toast } from "@zerodevx/svelte-toast";

  export let page: Page;

  let editing: boolean = false;
  let editingStarted: boolean = false;

  let title: string | null = null;
  let desc: string | null = null;
  let text: string | null = null;

  let newTitle: string | null = null;
  let newDesc: string | null = null;
  let newText: string | null = null;

  async function loadText() {
    if (page && !page.populated) {
      await page.populate();
      text = page.content.text;
    }
  }

  function startEditing() {
    newTitle = title;
    newDesc = desc;
    newText = text;
  }

  function cancelEditing() {
    editing = false;
    editingStarted = false;
    newTitle = null;
    newDesc = null;
    newText = null;
  }

  async function saveEdits() {
    const toastId = pushToast("Upload started");
    page.content.text = newText;
    page.meta.description = newDesc;
    page.meta.name = newTitle;
    try {
      await $currentDirectory.uploadPage(page);
      toast.pop(toastId);
      pushSuccessToast("Page saved");
    } catch (error) {
      console.log(error);
      toast.pop(toastId);
      pushErrorToast("Couldn't save edits");
    }
    cancelEditing();
  }

  $: page, loadText();
  $: editingStarted = editing || editingStarted;
  $: title = page ? page.meta.name : null;
  $: desc = page ? page.meta.description : null;
  $: pageHasDesc = page?.meta?.description ? true : false;
  $: text = page && page.populated ? page.content.text : null;
  $: pageHasText = page && page.populated && page?.content?.text ? true : false;
</script>

<h1>
  <span class={editing ? "invisible" : ""}
    >{newTitle ? newTitle : title ? title : "loading.."}</span
  >
  <input
    style="font-size: inherit;"
    class={editing ? "" : "invisible"}
    placeholder="Title"
    bind:value={newTitle}
  />
</h1>

<div class="description">
  <em class={editing ? "invisible" : ""}
    >{newDesc
      ? newDesc
      : desc
        ? desc
        : pageHasDesc
          ? "loading.."
          : "No description"}</em
  >
  <textarea
    style="font-size: inherit; width: 100%; box-sizing: border-box;"
    class={editing ? "" : "invisible"}
    placeholder="Description"
    bind:value={newDesc}
  />
</div>

<div class="separator">
  <div>
    <button
      class={editingStarted ? "" : "gray-button"}
      on:click={() => {
        if (!editingStarted) {
          startEditing();
        }
        editing = !editing;
      }}>{editing ? "Preview" : "Edit"}</button
    >
    {#if editingStarted}
      <button class="red-button" on:click={cancelEditing}>cancel changes</button
      >
      <button class="green-button" on:click={saveEdits}>save changes</button>
    {/if}
  </div>
  <button class="gray-button" disabled>Revisions</button>
</div>

<div
  class={editing ? "invisible" : ""}
  style={"text-align: " + (newText || text ? "left" : "center")}
>
  {#if newText}
    {@html DOMPurify.sanitize(parse(newText))}
  {:else if text}
    {@html DOMPurify.sanitize(parse(text))}
  {:else if !pageHasText}
    <em style="text-align: center">No text</em>
  {:else}
    <p>loading..</p>
  {/if}
</div>
<textarea
  style="width: 100%; height: 300px; box-sizing: border-box;"
  class={editing ? "" : "invisible"}
  placeholder="Markdown text"
  bind:value={newText}
/>

<style>
  .description {
    height: 3em;
    width: 100%;
  }

  .separator {
    border-bottom: solid 1px;
    display: flex;
    justify-content: space-between;
  }

  .invisible {
    display: none;
  }
</style>
