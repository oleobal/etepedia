<script lang="ts">
  import { logout } from "../nav";
  import { userSettings } from "../state.svelte";

  let deviceThemeOptions = new Map([
    ["light dark", "Detected"],
    ["only light", "Always light"],
    ["only dark", "Always dark"],
  ]);
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<h1>Settings</h1>

<p>
  On this device, the theme is
  <select
    id="force-device-theme"
    bind:value={$userSettings.preferredDeviceTheme}
  >
    {#each deviceThemeOptions as themeValue}
      <option value={themeValue[0]}>{themeValue[1]}</option>
    {/each}
  </select>
</p>

<button on:click={logout}>Log out</button>
