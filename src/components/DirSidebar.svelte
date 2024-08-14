<script lang="ts">
  import { directoriesById, etebaseAccount, userSettings } from "../stores";
  import DirectoryCard from "./DirectoryCard.svelte";
  import gearIconSvg from "../../static/gear-black.svg";
  import closeCrossIconSvg from "../../static/close-cross.svg";
  import { dndzone } from "svelte-dnd-action";
  import { onDestroy } from "svelte";
  import { flip } from "svelte/animate";
  import { push } from "svelte-spa-router";

  export let sidebarOpen = false;

  let dirItems: { id: string; isDndShadowItem?: boolean }[];
  const unsubscribeFromUserSettings = userSettings.subscribe(
    (us) =>
      (dirItems = us.directories.map((it) => {
        return { id: it };
      }))
  );
  onDestroy(unsubscribeFromUserSettings);

  let managementInProgress: boolean = false;

  const dragFlipDurationMs = 100;

  function handleDndConsider(e) {
    dirItems = e.detail.items;
  }
  function handleDndFinalize(e) {
    dirItems = e.detail.items;
    $userSettings.directories = dirItems.map((it) => it.id);
  }
</script>

<aside class:sidebarOpen>
  <nav>
    {#if $directoriesById.size == 0}No directories; <a href="#/create-directory"
        >create one</a
      >
    {:else}
      <div class="title">
        <div style="width: 30px"></div>
        {#if !managementInProgress}
          <h1 style="font-size: 19px;">Select a directory</h1>
        {:else}
          <p style="font-family: var(--ui-font)">Drag to reorder</p>
        {/if}
        <button
          class:gray-button={!managementInProgress}
          style="height: 30px; width: 30px; margin-right: 5px; font-size: 150%; padding: 0; flex-shrink: 0;"
          on:click={() => (managementInProgress = !managementInProgress)}
        >
          {#if managementInProgress}
            <img src={closeCrossIconSvg} alt="stop managing directories" />
          {:else}
            <img src={gearIconSvg} alt="manage directories" />
          {/if}
        </button>
      </div>

      {#if managementInProgress}
        <div
          class="dir-list"
          use:dndzone={{
            items: dirItems,
            flipDurationMs: dragFlipDurationMs,
            dropTargetStyle: {},
          }}
          on:consider={handleDndConsider}
          on:finalize={handleDndFinalize}
        >
          {#each dirItems as dirItem (dirItem.id)}
            <div animate:flip={{ duration: dragFlipDurationMs }}>
              {#if dirItem.isDndShadowItem}
                <div style="height: 40px;"></div>
              {:else}
                <div style="display:flex; align-items: center; width: 100%;">
                  <div style="flex-grow: 1; ">
                    <DirectoryCard
                      directory={$directoriesById.get(dirItem.id)}
                      inert={true}
                    />
                  </div>
                  <button
                    class="gray-button"
                    style="height: 20px; width: 20px; padding: 0; margin-left: 5px;"
                    on:click={() => push(`#/directory/${dirItem.id}`)}
                    ><img
                      src={gearIconSvg}
                      alt="manage this directory"
                    /></button
                  >
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <div class="dir-list">
          {#each dirItems as dirItem}
            <DirectoryCard
              directory={$directoriesById.get(dirItem.id)}
              inert={false}
            />
          {/each}
        </div>
      {/if}
      <a href="#/create-directory"><button>New directory</button></a>
    {/if}
    <div style="flex-grow: 1"></div>
    <div style="font-family: var(--ui-font)">
      Logged in as <b>{$etebaseAccount.user.username}</b>.
      <a
        href="#/settings"
        on:click={() => {
          sidebarOpen = false;
        }}>Settings</a
      >
    </div>
  </nav>
</aside>

<style>
  nav {
    all: unset; /* weird default style rules on nav */
    width: 100%;
    display: flex;
    flex-direction: column;

    justify-content: space-between;

    align-items: center;
    height: calc(100% - 50px) /* kludge to compensate for the top bar */;
  }

  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 57.5px; /* measured max value */
  }

  .dir-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow-y: auto;
    padding: 5px; /* padding here and not to the aside element so as not to clip box-shadows */
    box-sizing: border-box;
    margin-bottom: 5px;
  }

  aside {
    position: fixed;
    max-width: calc(
      100% + 1px
    ); /* because of box-sizing: border-box and not wanting to see the border in full-screen */
    width: 500px;
    top: 42px;
    height: 100%;
    box-sizing: border-box;

    border-right: solid 1px;
    border-bottom: solid 1px;
    border-color: var(--fg);
    background-color: var(--bg);

    left: calc(-100% - 1px);
    transition: left 0.2s ease-in-out;
  }

  .sidebarOpen {
    left: 0;
    box-shadow: -10px 0 40px var(--fg);
    clip-path: rect(
      0 0 100% 150%
    ); /* clip the shadow that would otherwise be on the top bar */
  }
</style>
