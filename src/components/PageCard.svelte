<script lang="ts">
  import { Page } from "../lib/eb";
  import { pushToast } from "../nav";

  export let page: Page;

  let pageLink: string;
  $: pageLink = `#/page/${page.item.uid}`;

  async function handleCopyLink() {
    await navigator.clipboard.writeText(pageLink);
    pushToast("Link copied to clipboard");
  }
</script>

<div class="outer">
  <a href={pageLink} class="page-info">
    <h3>
      {page.meta.name}
    </h3>
    {#if page.meta.description}
      <em>{page.meta.description}</em>
    {/if}
  </a>
  <div class="buttons">
    <button
      class="gray-button"
      on:click={handleCopyLink}
      style={"width: 100%;" + (page.meta.description ? "" : "height: 100%;")}
      title="Copy the internal (relative) link to this page">#</button
    >
  </div>
</div>

<style>
  h3,
  p {
    margin: 0;
  }
  a {
    color: var(--fg);
  }

  .outer {
    display: flex;

    justify-content: stretch;
    border: 1px solid;
    margin-bottom: 5px;
  }
  .outer:hover {
    border-color: var(--primary);
  }

  .page-info {
    text-align: left;
    padding: 10px;
    flex-grow: 1;
  }

  .buttons {
    width: 30px;
    min-width: 30px;
  }
</style>
