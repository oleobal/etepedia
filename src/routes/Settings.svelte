<script lang="ts">
  import { logout } from "../nav";
</script>

<svelte:head>
  <title>Settings</title>
</svelte:head>

<h1>Settings</h1>

<button on:click={logout}>Log out</button>
