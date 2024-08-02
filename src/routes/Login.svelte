<script lang="ts">
  import * as Etebase from "etebase";
  import { get } from "svelte/store";
  import {
    etebaseAccount,
    savedEtebaseSession,
    directories,
    currentDirectory,
  } from "../stores";
  import { listDirectories } from "../lib/eb";
  import { replace } from "svelte-spa-router";
  import { onMount } from "svelte";

  let username: string;
  let password: string;
  let endpoint: string;

  async function loadSession(ebAccount: Etebase.Account) {
    etebaseAccount.set(ebAccount);
    console.info("Successfully connected!");

    let dirs = await listDirectories(ebAccount);
    directories.set(dirs);
    if (dirs.length > 0) {
      currentDirectory.set(dirs[0]);
    }
    replace("/");
  }

  onMount(async () => {
    let savedSession: string | null = get(savedEtebaseSession);
    if (savedSession) {
      console.info("Restoring saved session");
      try {
        const ebAccount = await Etebase.Account.restore(savedSession);
        loadSession(ebAccount);
      } catch (error) {
        console.error("Couldn't restore saved session", error);
        savedEtebaseSession.reset();
      }
    } else {
      console.info("No previous session");
    }
  });

  async function handleLogin() {
    console.info("Logging into Etebase..");
    try {
      const ebAccount = await Etebase.Account.login(
        username,
        password,
        endpoint
      );
      const savedSession = await ebAccount.save();
      savedEtebaseSession.set(savedSession);

      await loadSession(ebAccount);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div
  id="login_form"
  style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      max-width: 300px;
      margin-right: auto;
      margin-left: auto;
      "
>
  <input style="width: 100%" placeholder="ETB username" bind:value={username} />
  <input
    style="width: 100%"
    placeholder="ETB password"
    type="password"
    bind:value={password}
  />
  <input style="width: 100%" placeholder="ETB endpoint" bind:value={endpoint} />
  <button on:click={handleLogin}>Log in</button>
</div>
