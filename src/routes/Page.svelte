<script lang="ts">
  import { etebaseState, userSettings } from "../state.svelte";
  import { Page } from "../lib/eb";
  import { parse } from "marked";
  import DOMPurify from "dompurify";
  import { pushToast, pushSuccessToast, pushErrorToast } from "../nav";
  import { toast } from "@zerodevx/svelte-toast";

  let { params } : { params: {uid: string}} = $props()

  let page : Page | null = $state(null)

  // load the page if it isn't in the cache
  $effect(() => {
    if (!etebaseState.cachedPages.get(params.uid)) {
      loadPage(params.uid).then((it) => {
        etebaseState.cachedPages.set(params.uid, it);
        page = it;
      })
    }
    else {
      page = etebaseState.cachedPages.get(params.uid);
    }
  })

  async function loadPage(uid: string): Promise<Page> {
    let page: Page;
    if (etebaseState.cachedPages.has(uid)) {
      return etebaseState.cachedPages.get(uid);
    }
    if (etebaseState.pagesIndex.has(uid)) {
      let dir = etebaseState.pagesIndex.get(uid);
      if (!dir.populated) {
        await dir.populate();
      }
      page = dir.pages.get(uid);
      if (dir != etebaseState.currentDirectory) {
        etebaseState.currentDirectory = dir;
      }
      await page.populate() // I could move this out of this function but that's more complex state handling
      return page;
    }
  }

  // update the list of recently visited pages
  $effect(() => {
    userSettings.update((us) => {
      let dir = etebaseState.pagesIndex.get(params.uid);
      if (!us.latestPageViewsByDirectory[dir.collection.uid]) {
        us.latestPageViewsByDirectory[dir.collection.uid] = [];
      }
      let existingIndex = us.latestPageViewsByDirectory[
        dir.collection.uid
      ].findIndex((it) => it === params.uid);
      if (existingIndex !== -1) {
        us.latestPageViewsByDirectory[dir.collection.uid].splice(
          existingIndex,
          1,
        );
      }
      let newLength = us.latestPageViewsByDirectory[dir.collection.uid].push(
        params.uid,
      );
      if (newLength > 100) {
        us.latestPageViewsByDirectory[dir.collection.uid].shift();
      }
      return us;
    });
  })


  let editing: boolean = $state(false);
  let editingStarted: boolean = $state(false);
  $effect(() => {
    editingStarted = editing || editingStarted;
  });

  let pageHasDesc = $derived(page?.meta?.description ? true : false);
  let pageHasText = $derived(
    page && page.populated && page?.content?.text ? true : false,
  );
  
  let newTitle: string | null = $state(null);
  let newDesc: string | null = $state(null);
  let newText: string | null = $state(null);

  function startEditing() {
    newTitle = page?.meta?.name;
    newDesc = page?.meta?.description;
    newText = page?.content?.text;
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
      await etebaseState.currentDirectory.uploadPage(page);
      toast.pop(toastId);
      pushSuccessToast("Page saved");
    } catch (error) {
      console.log(error);
      toast.pop(toastId);
      pushErrorToast("Couldn't save edits");
    }
    cancelEditing();
  }
</script>



<h1>
  <span class={editing ? "invisible" : ""}
    >{newTitle ? newTitle : page?.meta?.name ? page.meta.name : "loading.."}</span
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
      : page?.meta?.description
        ? page.meta.description
        : pageHasDesc
          ? "loading.."
          : "No description"}</em
  >
  <textarea
    style="font-size: inherit; width: 100%; box-sizing: border-box;"
    class={editing ? "" : "invisible"}
    placeholder="Description"
    bind:value={newDesc}
  ></textarea>
</div>

<div class="separator">
  <div>
    <button
      class={editingStarted ? "" : "gray-button"}
      onclick={() => {
        if (!editingStarted) {
          startEditing();
        }
        editing = !editing;
      }}>{editing ? "Preview" : "Edit"}</button
    >
    {#if editingStarted}
      <button class="red-button" onclick={cancelEditing}>cancel changes</button>
      <button class="green-button" onclick={saveEdits}>save changes</button>
    {/if}
  </div>
  <button class="gray-button" disabled title="Available soon!">Revisions</button>
</div>

<div
  class={editing ? "invisible" : ""}
  style={"text-align: " + (newText || page?.content?.text ? "left" : "center")}
>
  {#if newText}
    {@html DOMPurify.sanitize(parse(newText, { async: false }))}
  {:else if page?.content?.text}
    {@html DOMPurify.sanitize(parse(page?.content?.text, { async: false }))}
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
></textarea>

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
