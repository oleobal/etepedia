<script lang="ts">
  import { currentDirectory } from "../stores";
  import { Directory, Page } from "../lib/eb";
  import { onDestroy } from "svelte";
  import { onMount } from "svelte";

  export let params: { uid?: string } = {};

  let currentDir: Directory;

  const unsubscribe = currentDirectory.subscribe(
    (newVal) => (currentDir = newVal)
  );
  onDestroy(unsubscribe);

  var page: Page;
  if (currentDir.pages.get(params?.uid)) {
    page = currentDir.pages.get(params.uid);
  }

  var text: string | null = null;

  onMount(async () => {
    if (!page.populated) {
      await page.populate();
      text = page.content.article;
    }
  });
</script>

<h1>{page.meta.name}</h1>
<p><em>{page.meta.description}</em></p>

{#if text}
  <p>{text}</p>
{:else}
  <p>Loading..</p>
{/if}
