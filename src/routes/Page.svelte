<script lang="ts">
  import { currentDirectory, pagesById, userSettings } from "../stores";
  import { Directory, Page } from "../lib/eb";
  import { parse } from "marked";
  import DOMPurify from "dompurify";
  import { toast } from "@zerodevx/svelte-toast";

  export let params: { uid: string } = { uid: "" };

  var page: Page;
  var dir: Directory;
  var text: string | null = null;

  async function loadPage() {
    page = null;
    if ($pagesById.has(params?.uid)) {
      dir = $pagesById.get(params.uid);
      if (!dir.populated) {
        await dir.populate();
      }
      page = dir.pages.get(params.uid);
      if (dir != $currentDirectory) {
        currentDirectory.set(dir);
        toast.push(
          "Now viewing directory <b>" + dir.collection.getMeta().name + "</b>"
        );
      }
      if (!page.populated) {
        await page.populate();
      }
      text = page.content.article;

      userSettings.update((us) => {
        if (!us.latestPageViewsByDirectory[dir.collection.uid]) {
          us.latestPageViewsByDirectory[dir.collection.uid] = [];
        }
        let existingIndex = us.latestPageViewsByDirectory[
          dir.collection.uid
        ].findIndex((it) => it === page.item.uid);
        if (existingIndex !== -1) {
          us.latestPageViewsByDirectory[dir.collection.uid].splice(
            existingIndex,
            1
          );
        }
        let newLength = us.latestPageViewsByDirectory[dir.collection.uid].push(
          page.item.uid
        );
        if (newLength > 100) {
          us.latestPageViewsByDirectory[dir.collection.uid].shift();
        }
        return us;
      });
    }
  }

  $: params.uid, loadPage();
</script>

<svelte:head>
  <title>{page ? page.meta.name : "Etepedia"}</title>
</svelte:head>
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
