<script lang="ts">
  import { currentDirectory } from "../stores";
  import { Directory, Page } from "../lib/eb";
  import { push } from "svelte-spa-router";
  import { onDestroy } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import { parse } from "marked";
  import DOMPurify from "dompurify";

  let currentDir: Directory;

  const unsubscribe = currentDirectory.subscribe(
    (newVal) => (currentDir = newVal)
  );
  onDestroy(unsubscribe);

  let name: string;
  let description: string;
  let text: string;

  let previewing: boolean = false;
  let creating: boolean = false;

  async function switchPreview() {
    previewing = !previewing;
  }

  async function handleCreation() {
    creating = true;
    let page = new Page();
    page.meta.name = name;
    page.meta.description = description;
    page.content.article = text;

    await currentDir.uploadPage(page);

    currentDirectory.set(currentDir);

    toast.push("Page created");
    push(`/page/${page.item.uid}`);
  }
</script>

<div>
  <h1>Create page on {currentDir.collection.getMeta().name}</h1>
  <div class="form">
    <div class="max-width">
      <input
        class="max-width"
        style={"display: " + (previewing ? "none" : "block")}
        placeholder="Name"
        bind:value={name}
      />
      <h3 style={"display: " + (previewing ? "block" : "none")}>
        {name ? name : "No title"}
      </h3>
    </div>
    <div class="max-width">
      <textarea
        style={"display: " + (previewing ? "none" : "block")}
        class="max-width"
        placeholder="Description"
        bind:value={description}
      />
      <p style={"display: " + (previewing ? "block" : "none")}>
        <em>{description ? description : "No description"}</em>
      </p>
    </div>
    <div class="max-width">
      <textarea
        class="max-width"
        style={"min-height: 300px; " +
          "display: " +
          (previewing ? "none" : "block")}
        placeholder="Markdown text"
        bind:value={text}
      />
      <div style={"display: " + (previewing ? "block" : "none")}>
        {#if text}
          {@html DOMPurify.sanitize(parse(text))}
        {:else}
          <em>No contents</em>
        {/if}
      </div>
    </div>
    <div>
      <button on:click={switchPreview}
        >{previewing ? "Switch to edit" : "Switch to preview"}</button
      >
      <button
        on:click={handleCreation}
        disabled={!(name && description && text) || creating}>Create</button
      >
    </div>
  </div>
</div>

<style>
  .max-width {
    width: 100%;
  }

  .form {
    text-align: left;
  }
</style>
