<script lang="ts">
  import * as Etebase from "etebase";
  import { savedEtebaseSession } from "../stores";
  import {
    loadSession,
    pushErrorToast,
    pushSuccessToast,
    pushToast,
  } from "../nav";
  import { toast } from "@zerodevx/svelte-toast";

  let loginInProgress = false;
  let username: string;
  let password: string;
  let endpoint: string;

  async function handleLogin() {
    console.info("Logging into Etebase..");
    const toastId = pushToast("Logging into Etebase..", {
      initial: 0,
      theme: { "--toastBarHeight": "0px" },
    });
    loginInProgress = true;
    try {
      const ebAccount = await Etebase.Account.login(
        username,
        password,
        endpoint
      );
      const savedSession = await ebAccount.save();
      savedEtebaseSession.set(savedSession);

      await loadSession(ebAccount);
      toast.pop(toastId);
      pushSuccessToast(`Logged in as <b>${username}</b>`);
    } catch (error) {
      toast.pop(toastId);
      loginInProgress = false;
      console.error(error);
      if (error instanceof Etebase.UnauthorizedError) {
        pushErrorToast(`Couldn't log in: <b>${error.message}</b>`);
      } else {
        pushErrorToast("Couldn't log in");
      }
    }
  }
</script>

<div id="login">
  <h1 style="margin: 0;">Log in</h1>
  <i>Use your Etebase credentials</i>
  <input
    style="width: 100%"
    placeholder="Etebase username"
    bind:value={username}
  />
  <input
    style="width: 100%"
    placeholder="Etebase password"
    type="password"
    bind:value={password}
  />
  <input
    style="width: 100%"
    placeholder="Etebase endpoint"
    bind:value={endpoint}
  />
  <button on:click={handleLogin} disabled={loginInProgress}>Log in</button>
  <div style="margin-bottom:5vh">
    <!-- this is to compensate for the empty space above the h1 -->
  </div>
</div>

<style>
  #login {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    max-width: 300px;
    height: 100vh;
    margin-right: auto;
    margin-left: auto;
    justify-content: center;
  }
</style>
