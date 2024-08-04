<script lang="ts">
  import { currentDirectory, globalPageIndex } from "../stores";
  import { Directory, Page } from "../lib/eb";
  import { onDestroy } from "svelte";
  import { onMount } from "svelte";
  import { parse } from "marked";
  import DOMPurify from "dompurify";
  import { toast } from "@zerodevx/svelte-toast";

  export let params: { uid?: string } = {};

  let pageIndex: Map<string, Directory>;
  let currentDir: Directory;

  const unsubscribeFromCurrentDir = currentDirectory.subscribe(
    (newVal) => (currentDir = newVal)
  );
  onDestroy(unsubscribeFromCurrentDir);
  const unsubscribeFromPageIndex = globalPageIndex.subscribe(
    (newVal) => (pageIndex = newVal)
  );
  onDestroy(unsubscribeFromPageIndex);

  var page: Page;
  var dir: Directory;
  var text: string | null = null;

  onMount(async () => {
    if (pageIndex.get(params?.uid)) {
      dir = pageIndex.get(params.uid);
      if (!dir.populated) {
        await dir.populate();
      }
      page = dir.pages.get(params.uid);
      if (dir != currentDir) {
        currentDirectory.set(dir);
        toast.push("Now viewing directory " + dir.collection.getMeta().name);
      }
      if (!page.populated) {
        await page.populate();
      }
      text = page.content.article;
    } else {
    }
  });
</script>

<h1>{page ? page.meta.name : "Loading.."}</h1>
<p><em>{page ? page.meta.description : "Loading.."}</em></p>

<hr />

<div class="page-text">
  {#if text}
    {@html DOMPurify.sanitize(parse(text))}
  {:else}
    <p>Loading..</p>
  {/if}
</div>

<style>
  .page-text {
    text-align: left;
  }
</style>
